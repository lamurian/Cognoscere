/**
 * resolve_citation tool — parses a URL or DOI via citation.js, generates a
 * unique BibTeX citekey (lastname-year format), deduplicates against
 * notes.duckdb, and appends new entries to ref.bib.
 *
 * Workflow:
 *   1. Try citation.js to parse the source (DOI, DOI URL, or supported URL).
 *   2. Extract first author's last name + year → propose citekey
 *   3. Check notes.duckdb (by DOI → URL → citekey)
 *   4. If duplicate found → return existing citekey
 *   5. If new → resolve citekey collision (suffix a/b/c…), insert into
 *      DuckDB citations table, append to @ref.bib
 *   6. Return citekey + bibtex entry
 *
 * For non-DOI URLs (general web pages), the agent must provide title,
 * authors, and year as fallback metadata to construct a @misc entry.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { withDb, runWithRecovery, initDb, queryRows } from "../db.js";

const REF_BIB = "ref.bib";

interface CitationRow {
  citekey: string;
  bibtex: string;
  doi: string | null;
  source_url: string | null;
}

/**
 * Sanitise an author family name for use in a citekey: lowercase, remove
 * non-alphanumeric characters, collapse whitespace.
 */
function sanitiseFamily(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .trim();
}

/**
 * Generate a citekey from first-author family name and year.
 * e.g. "kucsko2013"
 */
function proposeCitekey(family: string, year: number): string {
  return `${sanitiseFamily(family)}${year}`;
}

/**
 * Resolve citekey collision by appending a suffix.
 * Checks DuckDB for existing collision keys.
 */
async function resolveCitekey(
  db: import("duckdb").Database,
  baseKey: string,
): Promise<string> {
  // Check if base key is taken
  const existing = await queryRows<{ citekey: string }>(
    db,
    "SELECT citekey FROM citations WHERE citekey = ?",
    baseKey,
  );
  if (existing.length === 0) return baseKey;

  // Try suffixes a, b, c, ... z
  for (let i = 97; i <= 122; i++) {
    const suffix = String.fromCharCode(i);
    const candidate = `${baseKey}${suffix}`;
    const taken = await queryRows<{ citekey: string }>(
      db,
      "SELECT citekey FROM citations WHERE citekey = ?",
      candidate,
    );
    if (taken.length === 0) return candidate;
  }

  // Fallback: append millisecond timestamp (extremely unlikely)
  return `${baseKey}-${Date.now()}`;
}

/**
 * Extract DOI from various input formats.
 */
function extractDoi(input: string): string | null {
  // Already a DOI
  if (/^10\.\d{4,}/.test(input)) return input;

  // doi.org URL
  const doiMatch = input.match(/doi\.org\/(10\.\d{4,}\/[^\s?#]+)/i);
  if (doiMatch) return doiMatch[1].replace(/\/$/, "");

  return null;
}

/**
 * Try to parse source via citation.js.
 * Returns { bibtex, data } or null on failure.
 */
async function tryCitationJs(
  source: string,
): Promise<{ bibtex: string; authorFamily: string; year: number; doi: string | null; url: string | null } | null> {
  try {
    const { Cite } = await import("@citation-js/core");
    await import("@citation-js/plugin-doi");
    await import("@citation-js/plugin-bibtex");
    await import("@citation-js/plugin-url");

    const cite = await Cite.async(source);
    const bibtex: string = cite.format("bibtex");
    if (!bibtex || !cite.data?.[0]) return null;

    const entry = cite.data[0];
    const authorFamily = entry.author?.[0]?.family;
    const year = entry.issued?.["date-parts"]?.[0]?.[0];
    if (!authorFamily || !year) return null;

    return {
      bibtex,
      authorFamily,
      year: Number(year),
      doi: entry.DOI || null,
      url: entry.URL || null,
    };
  } catch {
    return null;
  }
}

/**
 * Build a @misc BibTeX entry for a general web page.
 */
function buildMiscEntry(
  sourceUrl: string,
  title: string,
  authors: string[],
  year: number,
  accessed: string,
): string {
  const authorLine = authors.join(" and ");
  const citekey = proposeCitekey(
    authors[0]?.split(",")?.[0]?.trim() || "unknown",
    year,
  );
  return `@misc{${citekey},
\tauthor = {${authorLine}},
\ttitle = {${title}},
\turl = {${sourceUrl}},
\tyear = {${year}},
\tmonth = {${accessed.slice(0, 7)}},
\tnote = {Accessed: ${accessed}},
}
`;
}

export function registerResolveCitationTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "resolve_citation",
    label: "Resolve Citation",
    description:
      "Parse a URL or DOI via citation.js, generate a unique BibTeX citekey " +
      "(lastname-year format), deduplicate against the knowledge base, and " +
      "append new entries to @ref.bib. For general web pages (non-DOI), " +
      "provide title/authors/year as fallback metadata.",
    promptSnippet:
      "Resolve a citation source: parse via citation.js, check dedup, insert into " +
      "notes.duckdb and append to ref.bib if new.",
    parameters: Type.Object({
      source: Type.String({
        description:
          "DOI (e.g. '10.1038/nature12373') or URL to resolve. " +
          "For DOIs and DOI URLs, citation.js auto-fetches metadata.",
      }),
      title: Type.Optional(
        Type.String({
          description:
            "Title of the work (required when citation.js cannot parse the URL, " +
            "e.g. blog posts, news articles).",
        }),
      ),
      authors: Type.Optional(
        Type.Array(
          Type.String({
            description:
              "Author names in 'Last, First' format (required for fallback @misc entries).",
          }),
        ),
      ),
      year: Type.Optional(
        Type.Number({
          description: "Publication year (required for fallback @misc entries).",
        }),
      ),
      accessed: Type.Optional(
        Type.String({
          description:
            "Access date in ISO 8601 format (defaults to today). Used for @misc entries.",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const source = params.source.trim();
      const doi = extractDoi(source);
      const now = new Date().toISOString();

      onUpdate?.({
        content: [{ type: "text" as const, text: `📖 Resolving citation: ${source}…` }],
        details: {},
      });

      return await withDb(
        ctx.cwd,
        "write",
        async (db) => {
          await initDb(db);

          // ── Step 1: Check DuckDB for existing entry by DOI → URL ──
          let existing: CitationRow[] = [];

          if (doi) {
            existing = await queryRows<CitationRow>(
              db,
              "SELECT citekey, bibtex, doi, source_url FROM citations WHERE doi = ?",
              doi,
            );
          }

          if (existing.length === 0) {
            existing = await queryRows<CitationRow>(
              db,
              "SELECT citekey, bibtex, doi, source_url FROM citations WHERE source_url = ?",
              source,
            );
          }

          if (existing.length > 0) {
            const row = existing[0];
            return {
              content: [
                {
                  type: "text" as const,
                  text:
                    `✅ Citation already exists in knowledge base.\n` +
                    `Citekey: @${row.citekey}\n\n` +
                    `BibTeX entry:\n\`\`\`bibtex\n${row.bibtex}\n\`\`\``,
                },
              ],
              details: {
                citekey: row.citekey,
                bibtex: row.bibtex,
                isNew: false,
                doi: row.doi,
                source_url: row.source_url,
              },
            };
          }

          // ── Step 2: Try citation.js ──
          const parsed = await tryCitationJs(source);
          let bibtex: string;
          let authorFamily: string;
          let year: number;
          let resolvedDoi: string | null = doi;
          let resolvedUrl: string | null = source;

          if (parsed) {
            bibtex = parsed.bibtex;
            authorFamily = parsed.authorFamily;
            year = parsed.year;
            if (parsed.doi) resolvedDoi = parsed.doi;
            if (parsed.url) resolvedUrl = parsed.url;
          } else if (params.title && params.authors && params.authors.length > 0 && params.year) {
            // ── Fallback: construct @misc entry ──
            authorFamily = params.authors[0].split(",")?.[0]?.trim() || "unknown";
            year = params.year;
            const accessed = params.accessed || now.slice(0, 10);
            bibtex = buildMiscEntry(source, params.title, params.authors, year, accessed);
            resolvedUrl = source;
          } else {
            return {
              content: [
                {
                  type: "text" as const,
                  text:
                    `❌ Could not parse "${source}" via citation.js and no fallback metadata provided.\n` +
                    `To cite this source, provide: title, authors (array of "Last, First"), and year.`,
                },
              ],
              details: {
                citekey: null,
                bibtex: null,
                isNew: false,
                error: "citation.js parse failed, metadata required",
              },
            };
          }

          // ── Step 3: Generate and resolve citekey ──
          const baseKey = proposeCitekey(authorFamily, year);
          const citekey = await resolveCitekey(db, baseKey);

          // ── Step 4: Fix the citekey in the BibTeX entry ──
          // citation.js outputs its own citekey; replace with ours.
          // Pattern: @{GeneratedKey}{ maybe , or newline
          const fixedBibtex = bibtex.replace(/^@\w+\{([^,]+)/, (match, oldKey) => {
            return match.replace(oldKey, citekey);
          });

          // ── Step 5: Insert into DuckDB ──
          await runWithRecovery(
            db,
            "INSERT INTO citations (citekey, bibtex, doi, source_url, created, updated) VALUES (?, ?, ?, ?, ?, ?)",
            citekey,
            fixedBibtex,
            resolvedDoi,
            resolvedUrl,
            now,
            now,
          );

          // ── Step 6: Append to @ref.bib ──
          const refBibPath = resolve(ctx.cwd, REF_BIB);
          let existingBibContent = "";
          try {
            existingBibContent = await readFile(refBibPath, "utf-8");
          } catch {
            /* file doesn't exist yet — fine */
          }

          // Check if citekey already exists in ref.bib (safety check)
          if (!existingBibContent.includes(`@${citekey}`)) {
            // Ensure trailing newline before appending
            const separator = existingBibContent.length > 0 && !existingBibContent.endsWith("\n")
              ? "\n\n"
              : existingBibContent.length > 0
                ? "\n"
                : "";
            await appendFile(refBibPath, `${separator}${fixedBibtex}\n`, "utf-8");
          }

          return {
            content: [
              {
                type: "text" as const,
                text:
                  `✅ New citation created and saved.\n` +
                  `Citekey: @${citekey}\n` +
                  `Source: ${resolvedUrl || source}\n` +
                  `Appended to: ${REF_BIB}\n\n` +
                  `BibTeX entry:\n\`\`\`bibtex\n${fixedBibtex}\n\`\`\``,
              },
            ],
            details: {
              citekey,
              bibtex: fixedBibtex,
              isNew: true,
              doi: resolvedDoi,
              source_url: resolvedUrl,
            },
          };
        },
        { ctx, onUpdate },
      );
    },
  });
}
