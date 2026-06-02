/**
 * YAML Enforcer Extension — validates and repairs YAML frontmatter
 * in PARA markdown documents, and enforces standardised fields:
 *   title, description, author, editor, date, tags, source
 *
 * Capabilities:
 * 1. validate_frontmatter tool — scan files and repair invalid YAML
 * 2. check_frontmatter tool — check a specific file for YAML issues
 * 3. standardize_frontmatter tool — batch update field names
 * 4. Hooks into tool_result to validate after create/update_para_doc
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { analyzeFrontmatter, repairFileFrontmatter } from "./analyzer.js";
import { findParaMdFiles } from "./scanner.js";
import type { FrontmatterIssue } from "./analyzer.js";

function buildReport(
  filesToCheck: string[], totalIssues: number, totalFixed: number,
  results: Array<{ file: string; issues: FrontmatterIssue[]; fixed: boolean; changes: string[] }>,
  doRepair: boolean,
): string {
  const summary: string[] = [
    `Scanned ${filesToCheck.length} file(s)`,
    `Found ${totalIssues} issue(s)`,
    ...(doRepair ? [`Fixed ${totalFixed} issue(s)`] : []),
    "",
  ];
  for (const r of results) {
    if (r.issues.length === 0) continue;
    summary.push(`**${r.file}**${r.fixed ? " Fixed" : ""}`);
    for (const issue of r.issues) {
      summary.push(`  - [${issue.type}] ${issue.message}`);
      if (issue.suggestion) summary.push(`    -> ${issue.suggestion}`);
    }
    if (r.fixed && r.changes.length > 0) {
      for (const change of r.changes) summary.push(`    v ${change}`);
    }
    summary.push("");
  }
  if (!doRepair && totalIssues > 0) summary.push("Run with `repair: true` to automatically fix all issues.");
  return summary.join("\n");
}

export default function (pi: ExtensionAPI): void {
  pi.registerTool({
    name: "validate_frontmatter",
    label: "Validate Frontmatter",
    description: "Scan all PARA markdown files and check for invalid YAML frontmatter.",
    promptSnippet: "Scan and validate YAML frontmatter of PARA documents",
    parameters: Type.Object({
      path: Type.Optional(Type.String({ description: "Specific file path to validate (relative to project root). Omit to scan all." })),
      repair: Type.Optional(Type.Boolean({ description: "If true, automatically repair frontmatter issues. Default: false." })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const baseDir = ctx.cwd;
      const doRepair = params.repair ?? false;

      const filesToCheck: string[] = [];
      if (params.path) filesToCheck.push(resolve(baseDir, params.path));
      else filesToCheck.push(...(await findParaMdFiles(baseDir)));

      if (filesToCheck.length === 0) {
        return { content: [{ type: "text" as const, text: "No PARA markdown files found to validate." }], details: { scanned: 0, issues: 0, fixed: 0, results: [] } };
      }

      let totalIssues = 0, totalFixed = 0;
      const results: Array<{ file: string; issues: FrontmatterIssue[]; fixed: boolean; changes: string[] }> = [];

      for (const filePath of filesToCheck) {
        const relPath = relative(baseDir, filePath);
        try {
          const content = await readFile(filePath, "utf-8");
          const analysis = analyzeFrontmatter(content);
          if (analysis.issues.length > 0) {
            totalIssues += analysis.issues.length;
            if (doRepair) {
              const repairResult = await repairFileFrontmatter(
                async (p) => await readFile(p, "utf-8"),
                async (p, c) => await writeFile(p, c, "utf-8"),
                filePath,
              );
              if (repairResult.fixed && repairResult.content) {
                await writeFile(filePath, repairResult.content, "utf-8");
                totalFixed += repairResult.changes.length;
                results.push({ file: relPath, issues: analysis.issues, fixed: true, changes: repairResult.changes });
                continue;
              }
            }
            results.push({ file: relPath, issues: analysis.issues, fixed: false, changes: [] });
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          results.push({ file: relPath, issues: [{ type: "invalid-yaml", message: `Error reading file: ${msg}` }], fixed: false, changes: [] });
          totalIssues++;
        }
      }

      if (totalIssues === 0) {
        return { content: [{ type: "text" as const, text: `All ${filesToCheck.length} files have valid YAML frontmatter.` }], details: { scanned: filesToCheck.length, issues: 0, fixed: 0, results: [] } };
      }

      return { content: [{ type: "text" as const, text: buildReport(filesToCheck, totalIssues, totalFixed, results, doRepair) }], details: { scanned: filesToCheck.length, issues: totalIssues, fixed: doRepair ? totalFixed : 0, results: results.map((r) => ({ file: r.file, issueCount: r.issues.length, fixed: r.fixed, changes: r.changes })) } };
    },
  });

  pi.registerTool({
    name: "standardize_frontmatter",
    label: "Standardize Frontmatter",
    description: "Batch-rename legacy frontmatter fields to their standardised names.",
    promptSnippet: "Batch standardise frontmatter field names across all PARA documents",
    parameters: Type.Object({
      dryRun: Type.Optional(Type.Boolean({ description: "If true, only report what would change without modifying files. Default: true." })),
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
        const fieldChanges: string[] = [];

        const FIELD_ALIASES: Record<string, string> = { source_url: "source", url: "source", created: "date" };
        for (const key of analysis.keyOrder) {
          const canonical = FIELD_ALIASES[key];
          if (canonical) fieldChanges.push(`'${key}' -> '${canonical}'`);
        }

        if (fieldChanges.length > 0) {
          changed++;
          details.push({ file: relPath, changes: fieldChanges });
          if (!dryRun) {
            const repairResult = await repairFileFrontmatter(
              async (p) => await readFile(p, "utf-8"),
              async (p, c) => await writeFile(p, c, "utf-8"),
              filePath,
            );
            if (repairResult.fixed && repairResult.content) await writeFile(filePath, repairResult.content, "utf-8");
          }
        }
      }

      if (changed === 0) return { content: [{ type: "text" as const, text: "All files already use standardised field names." }], details: { dryRun, changed: 0 } };

      const lines = [`Scanned ${files.length} files`, `Found ${changed} file(s) with legacy field names:`, "",
        ...details.flatMap((d) => [`**${d.file}**`, ...d.changes.map((c) => `  - ${c}`), ""]),
        dryRun ? "Run with `dryRun: false` to apply changes." : "Changes applied.",
      ];
      return { content: [{ type: "text" as const, text: lines.join("\n") }], details: { dryRun, changed, files: details } };
    },
  });

  pi.registerTool({
    name: "check_frontmatter",
    label: "Check Frontmatter",
    description: "Check a single file's YAML frontmatter for validity and standardisation issues.",
    promptSnippet: "Check a specific PARA document's YAML frontmatter for issues",
    parameters: Type.Object({
      path: Type.String({ description: "Relative path to the markdown file, e.g. Resources/my-doc.md" }),
      repair: Type.Optional(Type.Boolean({ description: "Repair issues if found. Default: false." })),
    }),

    /* eslint-disable-next-line complexity */
    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const filePath = resolve(ctx.cwd, params.path);
      const doRepair = params.repair ?? false;

      try {
        const content = await readFile(filePath, "utf-8");
        const analysis = analyzeFrontmatter(content);
        const relPath = relative(ctx.cwd, filePath);

        const lines = [
          `**${relPath}**`,
          `Frontmatter: ${analysis.hasFrontmatter ? "Present" : "Missing"}`,
          `Fields found: ${analysis.keyOrder.join(", ") || "(none)"}`,
          `Issues: ${analysis.issues.length}`,
          "",
        ];

        if (analysis.issues.length === 0) lines.push("Frontmatter is valid and standardised.");
        else for (const issue of analysis.issues) {
          lines.push(`- [${issue.type}] ${issue.message}`);
          if (issue.suggestion) lines.push(`  -> ${issue.suggestion}`);
        }

        if (doRepair && analysis.issues.length > 0) {
          const repairResult = await repairFileFrontmatter(
            async (p) => await readFile(p, "utf-8"),
            async (p, c) => await writeFile(p, c, "utf-8"),
            filePath,
          );
          if (repairResult.fixed && repairResult.content) {
            await writeFile(filePath, repairResult.content, "utf-8");
            lines.push("", "Repairs applied:");
            for (const change of repairResult.changes) lines.push(`  v ${change}`);
          }
        } else if (!doRepair && analysis.issues.length > 0) {
          lines.push("", "Run with `repair: true` to fix automatically.");
        }

        return { content: [{ type: "text" as const, text: lines.join("\n") }], details: { file: relPath, hasFrontmatter: analysis.hasFrontmatter, issues: analysis.issues, keyOrder: analysis.keyOrder } };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { isError: true, content: [{ type: "text" as const, text: `Error: ${msg}` }], details: {} };
      }
    },
  });

  pi.on("tool_result", async (event, _ctx) => {
    if (event.toolName !== "create_para_doc" && event.toolName !== "update_para_doc") return;
    const details = event.details as Record<string, unknown> | undefined;
    const filePath = details?.path as string | undefined;
    if (!filePath || typeof filePath !== "string") return;

    try {
      const content = await readFile(filePath, "utf-8");
      const analysis = analyzeFrontmatter(content);
      if (analysis.issues.length > 0) {
        const repairResult = await repairFileFrontmatter(
          async (p) => await readFile(p, "utf-8"),
          async (p, c) => await writeFile(p, c, "utf-8"),
          filePath,
        );
        if (repairResult.fixed && repairResult.content) {
          await writeFile(filePath, repairResult.content, "utf-8");
          return { content: [...(event.content ?? []), { type: "text" as const, text: `\nYAML frontmatter auto-repaired: ${repairResult.changes.join(", ")}` }], details: { ...(event.details ?? {}), yamlRepaired: repairResult.changes } };
        }
      }
    } catch { /* silently ignore read errors */ }
  });
}
