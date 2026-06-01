/**
 * YAML Enforcer Extension — validates and repairs YAML frontmatter
 * in PARA markdown documents, and enforces standardised fields:
 *
 *   title, description, author, editor, date, tags, source
 *
 * Capabilities:
 * 1. `validate_frontmatter` tool — scan files and repair invalid YAML
 * 2. `check_frontmatter` tool — check a specific file for YAML issues
 * 3. `standardize_frontmatter` tool — batch update field names (source_url → source, etc.)
 * 4. Hooks into `tool_result` to validate after create_para_doc / update_para_doc
 *
 * ISO8601 date helper used for consistent YAML-safe date formatting.
 */

import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { resolve, join, relative } from "node:path";

// ── Constants ───────────────────────────────────────────────────────

/** Standardised frontmatter field ordering (when rewriting). */
const STANDARD_FIELDS = [
  "title",
  "description",
  "author",
  "editor",
  "date",
  "tags",
  "source",
] as const;

/** Canonical field name mappings (old → new). */
const FIELD_ALIASES: Record<string, string> = {
  source_url: "source",
  url: "source",
  created: "date",
};

/** PARA directories to scan. */
const PARA_DIRS = ["Areas", "Projects", "Resources"] as const;

// ── YAML helpers ────────────────────────────────────────────────────

/** Regexes for detecting YAML values that need quoting. */
const YAML_NEEDS_QUOTE = /^[\[\]\{\}\,\&\*\!\|\>\'\"\%\@\`\#\:\?\-\s]/;
const YAML_SPECIAL_PATTERN = /\: /;  // colon-space
const YAML_BOOL_LIKE = /^(true|false|yes|no|on|off|null|undefined|~)$/i;
const YAML_NUMBER = /^\d+(\.\d+)?$/;

function needsYamlQuoting(value: string): boolean {
  if (value.length === 0) return true;
  if (YAML_NEEDS_QUOTE.test(value)) return true;
  if (YAML_SPECIAL_PATTERN.test(value)) return true;
  if (YAML_BOOL_LIKE.test(value)) return true;
  if (YAML_NUMBER.test(value)) return true;
  return false;
}

function yamlQuote(value: string): string {
  if (!needsYamlQuoting(value)) return value;
  if (value.includes("'")) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  return `'${value}'`;
}

// ── Frontmatter parsing ────────────────────────────────────────────

/** Result of frontmatter analysis. */
interface FrontmatterAnalysis {
  hasFrontmatter: boolean;
  rawBlock: string;
  bodyStart: number;
  /** All key-value pairs found (including tags as a list). */
  fields: Record<string, string | string[]>;
  /** Validation issues found. */
  issues: FrontmatterIssue[];
  /** Order of keys as they appear in the file. */
  keyOrder: string[];
}

interface FrontmatterIssue {
  type: "invalid-yaml" | "needs-quoting" | "nonstandard-field" | "missing-field";
  field?: string;
  message: string;
  suggestion?: string;
}

function analyzeFrontmatter(content: string): FrontmatterAnalysis {
  const result: FrontmatterAnalysis = {
    hasFrontmatter: false,
    rawBlock: "",
    bodyStart: 0,
    fields: {},
    issues: [],
    keyOrder: [],
  };

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    result.issues.push({
      type: "invalid-yaml",
      message: "No YAML frontmatter block found (missing --- delimiters)",
    });
    return result;
  }

  result.hasFrontmatter = true;
  result.rawBlock = match[1];
  result.bodyStart = match[0].length;

  const lines = match[1].split("\n");
  let currentKey = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Key: value line
    const kv = line.match(/^([\w_-]+):\s*(.*)/);
    if (kv) {
      currentKey = kv[0].trim(); // store for list parsing
      const key = kv[1];
      const rawVal = kv[2].trim();
      result.keyOrder.push(key);

      if (rawVal && !rawVal.startsWith("-")) {
        // Check if value needs quoting
        const val = rawVal.replace(/^['"]|['"]$/g, ""); // strip existing quotes
        if (needsYamlQuoting(val) && !isQuoted(rawVal)) {
          result.issues.push({
            type: "needs-quoting",
            field: key,
            message: `Value for '${key}' contains YAML-special characters and needs quoting`,
            suggestion: `${key}: ${yamlQuote(val)}`,
          });
        }

        // Check for non-standard field names
        const canonical = FIELD_ALIASES[key];
        if (canonical) {
          result.issues.push({
            type: "nonstandard-field",
            field: key,
            message: `'${key}' should be renamed to '${canonical}' (standardised field)`,
            suggestion: `Replace '${key}: ...' with '${canonical}: ...'`,
          });
        }

        // Store value
        if (!result.fields[key]) {
          result.fields[key] = rawVal;
        }
      }
    }

    // Tag list items
    const li = line.match(/^\s*-\s+(.+)/);
    if (li && currentKey.startsWith("tags")) {
      if (!Array.isArray(result.fields.tags)) {
        result.fields.tags = [];
      }
      (result.fields.tags as string[]).push(li[1].trim());
    }
  }

  // Check for missing standard fields
  const presentKeys = new Set(result.keyOrder);
  const standard = new Set(STANDARD_FIELDS);
  for (const field of STANDARD_FIELDS) {
    if (field === "tags" || field === "source") continue; // optional
    if (!presentKeys.has(field)) {
      result.issues.push({
        type: "missing-field",
        field,
        message: `Standard field '${field}' is missing`,
        suggestion: `Add '${field}: ...' to the frontmatter`,
      });
    }
  }
  // description is recommended but not required
  if (!presentKeys.has("description")) {
    result.issues.push({
      type: "missing-field",
      field: "description",
      message: "Recommended field 'description' is missing (≤200 chars, enriches search)",
      suggestion: "Add 'description: Short summary...'",
    });
  }

  return result;
}

function isQuoted(value: string): boolean {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  );
}

// ── Repair frontmatter ─────────────────────────────────────────────

/**
 * Repair and standardise a file's frontmatter in one pass.
 * Returns the fixed content, or null if no changes needed.
 */
async function repairFileFrontmatter(filePath: string): Promise<{
  fixed: boolean;
  changes: string[];
  content: string | null;
}> {
  const content = await readFile(filePath, "utf-8");
  const analysis = analyzeFrontmatter(content);
  const changes: string[] = [];

  if (!analysis.hasFrontmatter) {
    return { fixed: false, changes: [], content: null };
  }

  // If no issues, return as-is
  if (analysis.issues.length === 0) {
    return { fixed: false, changes: [], content: null };
  }

  // Rebuild the frontmatter from scratch
  const now = new Date().toISOString();

  // Collect fields in standardised order
  const fields: Record<string, unknown> = {};

  // Start with existing values, mapping old field names to canonical ones
  for (const key of analysis.keyOrder) {
    const canonical = FIELD_ALIASES[key] ?? key;
    const rawVal = analysis.fields[key];
    if (rawVal !== undefined && !key.startsWith("tags")) {
      const val = typeof rawVal === "string" ? rawVal.replace(/^['"]|['"]$/g, "") : rawVal;
      if (canonical === "date") {
        // Ensure date is ISO 8601
        fields[canonical] = normalizeDate(val as string) || now;
      } else if (canonical === "source") {
        fields[canonical] = val;
      } else if (canonical !== "tags") {
        fields[canonical] = val;
      }
    }
  }

  // Tags from existing list
  const existingTags = analysis.fields.tags;
  if (Array.isArray(existingTags) && existingTags.length > 0) {
    fields.tags = existingTags;
  }

  // Ensure standard fields with defaults
  if (!fields.title) fields.title = "";
  if (!fields.author) fields.author = "pi";
  if (!fields.editor) fields.editor = "lam";
  if (!fields.date) fields.date = now;

  // Build new frontmatter using formatFrontmatter (from the para-knowledge extension)
  // We replicate the logic here to avoid cross-extension coupling
  const newFrontmatter = buildStandardFrontmatter(fields);

  // Find body: everything after the frontmatter block
  const bodyEndMatch = content.match(/^---\n[\s\S]*?\n---\n?/);
  const body = bodyEndMatch
    ? content.slice(bodyEndMatch[0].length).trim()
    : content.trim();

  const newContent = newFrontmatter + "\n" + body;

  // Track what changed
  for (const issue of analysis.issues) {
    if (issue.type === "needs-quoting") {
      changes.push(`Quoted value for '${issue.field}'`);
    } else if (issue.type === "nonstandard-field") {
      changes.push(`Renamed '${issue.field}' → standardised name`);
    } else if (issue.type === "missing-field" && issue.field !== "description") {
      changes.push(`Added missing field '${issue.field}'`);
    }
  }

  return { fixed: true, changes, content: newContent };
}

/**
 * Normalize a date string to ISO format if possible.
 */
function normalizeDate(dateStr: string): string | null {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {
    // ignore
  }
  return null;
}

/**
 * Build standardised YAML frontmatter from fields.
 * Replicates the logic from para-knowledge/frontmatter.ts formatFrontmatter
 * (cannot import directly due to extension isolation).
 */
function buildStandardFrontmatter(fields: Record<string, unknown>): string {
  let out = "---\n";

  for (const key of STANDARD_FIELDS) {
    if (key === "tags") {
      const v = fields.tags;
      if (Array.isArray(v) && v.length > 0) {
        out += "tags:\n";
        for (const t of v) {
          out += `  - ${yamlQuote(String(t))}\n`;
        }
      }
    } else if (key === "source") {
      const v = fields.source || fields.source_url;
      if (typeof v === "string" && v) {
        out += `source: ${yamlQuote(v)}\n`;
      }
    } else if (key === "date") {
      const v = fields.date || fields.created || fields.modified || new Date().toISOString();
      if (typeof v === "string" && v) {
        out += `date: ${yamlQuote(v)}\n`;
      }
    } else {
      const v = fields[key];
      if (typeof v === "string" && v) {
        out += `${key}: ${yamlQuote(v)}\n`;
      }
    }
  }

  // Emit any legacy fields not covered above
  for (const [k, v] of Object.entries(fields)) {
    if ((STANDARD_FIELDS as readonly string[]).includes(k as any)) continue;
    if (k === "source_url" || k === "url") continue; // handled by source alias
    if (typeof v === "string" && v) {
      out += `${k}: ${yamlQuote(v)}\n`;
    }
  }

  return out + "---";
}

// ── Find PARA files ────────────────────────────────────────────────

async function findParaMdFiles(baseDir: string): Promise<string[]> {
  const files: string[] = [];
  for (const dir of PARA_DIRS) {
    const abs = resolve(baseDir, dir);
    try {
      const entries = await readdir(abs);
      for (const name of entries) {
        if (name.endsWith(".md")) {
          files.push(join(abs, name));
        }
      }
    } catch {
      // directory doesn't exist yet
    }
  }
  return files.sort();
}

// ── Extension entry point ──────────────────────────────────────────

export default function (pi: ExtensionAPI): void {
  // ── Tool: validate_frontmatter ──
  pi.registerTool({
    name: "validate_frontmatter",
    label: "Validate Frontmatter",
    description:
      "Scan all PARA markdown files (Areas/Projects/Resources) and check for " +
      "invalid YAML frontmatter. Reports issues like unquoted colons in titles, " +
      "non-standard field names, and missing recommended fields. Optionally repairs them.",
    promptSnippet:
      "Scan and validate YAML frontmatter of PARA documents, fixing unquoted colons and standardising fields",
    promptGuidelines: [
      "Use validate_frontmatter when the user reports YAML frontmatter issues.",
      "Use validate_frontmatter after upgrading the frontmatter code to fix existing files.",
      "Pass repair: true to automatically fix all issues found.",
    ],
    parameters: Type.Object({
      path: Type.Optional(
        Type.String({
          description:
            "Specific file path to validate (relative to project root). " +
            "Omit to scan all AREA/Projects/Resources files.",
        }),
      ),
      repair: Type.Optional(
        Type.Boolean({
          description:
            "If true, automatically repair frontmatter issues (quote values, rename fields, add missing fields). Default: false.",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const baseDir = ctx.cwd;
      const doRepair = params.repair ?? false;

      // Determine files to scan
      const filesToCheck: string[] = [];
      if (params.path) {
        filesToCheck.push(resolve(baseDir, params.path));
      } else {
        filesToCheck.push(...(await findParaMdFiles(baseDir)));
      }

      if (filesToCheck.length === 0) {
        return {
          content: [{ type: "text" as const, text: "No PARA markdown files found to validate." }],
          details: { scanned: 0, issues: 0, fixed: 0, results: [] },
        };
      }

      let totalIssues = 0;
      let totalFixed = 0;
      const results: Array<{
        file: string;
        issues: FrontmatterIssue[];
        fixed: boolean;
        changes: string[];
      }> = [];

      for (const filePath of filesToCheck) {
        const relPath = relative(baseDir, filePath);
        try {
          const content = await readFile(filePath, "utf-8");
          const analysis = analyzeFrontmatter(content);

          if (analysis.issues.length > 0) {
            totalIssues += analysis.issues.length;

            if (doRepair) {
              const repairResult = await repairFileFrontmatter(filePath);
              if (repairResult.fixed && repairResult.content) {
                await writeFile(filePath, repairResult.content, "utf-8");
                totalFixed += repairResult.changes.length;
                results.push({
                  file: relPath,
                  issues: analysis.issues,
                  fixed: true,
                  changes: repairResult.changes,
                });
                continue;
              }
            }

            results.push({
              file: relPath,
              issues: analysis.issues,
              fixed: false,
              changes: [],
            });
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          results.push({
            file: relPath,
            issues: [{ type: "invalid-yaml", message: `Error reading file: ${msg}` }],
            fixed: false,
            changes: [],
          });
          totalIssues++;
        }
      }

      // Build report
      if (totalIssues === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `✅ All ${filesToCheck.length} files have valid YAML frontmatter. No issues found.`,
            },
          ],
          details: {
            scanned: filesToCheck.length,
            issues: 0,
            fixed: 0,
            results: [],
          },
        };
      }

      const summary: string[] = [
        `📋 Scanned ${filesToCheck.length} file(s)`,
        `⚠️  Found ${totalIssues} issue(s)`,
        ...(doRepair ? [`🔧 Fixed ${totalFixed} issue(s)`] : []),
        "",
      ];

      for (const r of results) {
        if (r.issues.length === 0) continue;
        summary.push(`**${r.file}**${r.fixed ? " ✅ Fixed" : ""}`);
        for (const issue of r.issues) {
          summary.push(`  - [${issue.type}] ${issue.message}`);
          if (issue.suggestion) {
            summary.push(`    → ${issue.suggestion}`);
          }
        }
        if (r.fixed && r.changes.length > 0) {
          for (const change of r.changes) {
            summary.push(`    ✓ ${change}`);
          }
        }
        summary.push("");
      }

      if (!doRepair && totalIssues > 0) {
        summary.push(
          "💡 Run with `repair: true` to automatically fix all issues.",
        );
      }

      return {
        content: [{ type: "text" as const, text: summary.join("\n") }],
        details: {
          scanned: filesToCheck.length,
          issues: totalIssues,
          fixed: doRepair ? totalFixed : 0,
          results: results.map((r) => ({
            file: r.file,
            issueCount: r.issues.length,
            fixed: r.fixed,
            changes: r.changes,
          })),
        },
      };
    },
  });

  // ── Tool: standardize_frontmatter ──
  pi.registerTool({
    name: "standardize_frontmatter",
    label: "Standardize Frontmatter",
    description:
      "Batch-rename legacy frontmatter fields to their standardised names " +
      "(source_url → source, url → source, created → date) across all PARA documents.",
    promptSnippet:
      "Batch standardise frontmatter field names across all PARA documents",
    parameters: Type.Object({
      dryRun: Type.Optional(
        Type.Boolean({
          description:
            "If true, only report what would change without modifying files. Default: true.",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const baseDir = ctx.cwd;
      const dryRun = params.dryRun ?? true;
      const files = await findParaMdFiles(baseDir);

      let changed = 0;
      const details: Array<{ file: string; changes: string[] }> = [];

      for (const filePath of files) {
        const relPath = relative(baseDir, filePath);
        const content = await readFile(filePath, "utf-8");
        const analysis = analyzeFrontmatter(content);

        // Check for legacy field names
        const fieldChanges: string[] = [];
        for (const key of analysis.keyOrder) {
          const canonical = FIELD_ALIASES[key];
          if (canonical) {
            fieldChanges.push(
              `'${key}' → '${canonical}' (value: ${analysis.fields[key]})`,
            );
          }
        }

        if (fieldChanges.length > 0) {
          changed++;
          details.push({ file: relPath, changes: fieldChanges });

          if (!dryRun) {
            const repairResult = await repairFileFrontmatter(filePath);
            if (repairResult.fixed && repairResult.content) {
              await writeFile(filePath, repairResult.content, "utf-8");
            }
          }
        }
      }

      if (changed === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "✅ All files already use standardised field names.",
            },
          ],
          details: { dryRun, changed: 0 },
        };
      }

      const summary = [
        `📋 Scanned ${files.length} files`,
        `Found ${changed} file(s) with legacy field names:`,
        "",
        ...details.flatMap((d) => [
          `**${d.file}**`,
          ...d.changes.map((c) => `  - ${c}`),
          "",
        ]),
        dryRun
          ? "💡 Run with `dryRun: false` to apply changes."
          : "✅ Changes applied.",
      ];

      return {
        content: [{ type: "text" as const, text: summary.join("\n") }],
        details: { dryRun, changed, files: details },
      };
    },
  });

  // ── Tool: check_frontmatter ──
  pi.registerTool({
    name: "check_frontmatter",
    label: "Check Frontmatter",
    description:
      "Check a single file's YAML frontmatter for validity and standardisation issues. " +
      "Reports field ordering, quoting problems, and missing recommended fields.",
    promptSnippet:
      "Check a specific PARA document's YAML frontmatter for issues",
    parameters: Type.Object({
      path: Type.String({
        description: "Relative path to the markdown file, e.g. Resources/my-doc.md",
      }),
      repair: Type.Optional(
        Type.Boolean({ description: "Repair issues if found. Default: false." }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const filePath = resolve(ctx.cwd, params.path);
      const doRepair = params.repair ?? false;

      try {
        const content = await readFile(filePath, "utf-8");
        const analysis = analyzeFrontmatter(content);
        const relPath = relative(ctx.cwd, filePath);

        const lines = [
          `📄 ${relPath}`,
          `Frontmatter: ${analysis.hasFrontmatter ? "✅ Present" : "⚠️ Missing"}`,
          `Fields found: ${analysis.keyOrder.join(", ") || "(none)"}`,
          `Issues: ${analysis.issues.length}`,
          "",
        ];

        if (analysis.issues.length === 0) {
          lines.push("✅ Frontmatter is valid and standardised.");
        } else {
          for (const issue of analysis.issues) {
            lines.push(`- [${issue.type}] ${issue.message}`);
            if (issue.suggestion) {
              lines.push(`  → ${issue.suggestion}`);
            }
          }
        }

        if (doRepair && analysis.issues.length > 0) {
          const repairResult = await repairFileFrontmatter(filePath);
          if (repairResult.fixed && repairResult.content) {
            await writeFile(filePath, repairResult.content, "utf-8");
            lines.push("", "✅ Repairs applied:");
            for (const change of repairResult.changes) {
              lines.push(`  ✓ ${change}`);
            }
          } else {
            lines.push("", "ℹ️ No repairs needed or file not modified.");
          }
        } else if (!doRepair && analysis.issues.length > 0) {
          lines.push("", "💡 Run with `repair: true` to fix automatically.");
        }

        return {
          content: [{ type: "text" as const, text: lines.join("\n") }],
          details: {
            file: relPath,
            hasFrontmatter: analysis.hasFrontmatter,
            issues: analysis.issues,
            keyOrder: analysis.keyOrder,
          },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: ${msg}` }],
        };
      }
    },
  });

  // ── Hook: validate after create/update tool results ──
  pi.on("tool_result", async (event, ctx) => {
    // Only check file-writing tools that produce .md files
    if (
      event.toolName !== "create_para_doc" &&
      event.toolName !== "update_para_doc"
    ) {
      return;
    }

    // Extract the file path from details
    const details = event.details as Record<string, unknown> | undefined;
    const filePath = details?.path as string | undefined;

    if (!filePath || typeof filePath !== "string") return;

    // Check frontmatter of the just-written file
    try {
      const content = await readFile(filePath, "utf-8");
      const analysis = analyzeFrontmatter(content);

      if (analysis.issues.length > 0) {
        // Attempt auto-repair on the fly
        const repairResult = await repairFileFrontmatter(filePath);
        if (repairResult.fixed && repairResult.content) {
          await writeFile(filePath, repairResult.content, "utf-8");
          console.error(
            `[yaml-enforcer] Auto-repaired ${filePath}: ${repairResult.changes.join(", ")}`,
          );

          // Annotate the result with repair info
          return {
            content: [
              ...(event.content ?? []),
              {
                type: "text" as const,
                text: `\n🔧 YAML frontmatter auto-repaired: ${repairResult.changes.join(", ")}`,
              },
            ],
            details: {
              ...(event.details ?? {}),
              yamlRepaired: repairResult.changes,
            },
          };
        }
      }
    } catch {
      // Silently ignore read errors on post-hoc check
    }
  });
}
