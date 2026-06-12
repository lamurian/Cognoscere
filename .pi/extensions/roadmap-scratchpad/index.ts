/**
 * roadmap_scratchpad — temporary state files for the roadmap skill,
 * stored as PARA documents in Areas/ for searchability via notes.db.
 *
 * Each scratchpad is a markdown file with YAML frontmatter (so it gets
 * indexed by the PARA knowledge system) and a JSON body containing the
 * full roadmap state (steps, questions, search results, milestones).
 *
 * Tools provided:
 *   init_scratchpad    — create a new scratchpad, register in DuckDB
 *   update_scratchpad  — update scratchpad state (partial merge)
 *   delete_scratchpad  — delete scratchpad file and DuckDB entries
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import type { ScratchpadData, ScratchpadUpdate } from "./types.js";
import {
  buildScratchpadFile,
  parseScratchpadBody,
  mergeData,
  scratchpadRelPath,
  scratchpadAbsPath,
} from "./utils.js";
import { registerInDb, updateDbIndex, deleteFromDb } from "./helpers.js";

// ══════════════════════════════════════════════════════════════════════
//  Extension entry point
// ══════════════════════════════════════════════════════════════════════

export default function (pi: ExtensionAPI): void {
  // ── Tool 1: init_scratchpad ──────────────────────────────────────
  pi.registerTool({
    name: "init_scratchpad",
    label: "Init Scratchpad",
    description:
      "Create a new roadmap scratchpad file in Areas/ as a PARA document (markdown + YAML frontmatter) " +
      "and register it in notes.db for searchability.",
    promptSnippet: "Create a new roadmap scratchpad in Areas/",
    parameters: Type.Object({
      name: Type.String({
        description: "Short kebab-case name (e.g. 'statistics-bayesian-frequentist')",
      }),
      description: Type.String({
        description: "Concise description for searchability in notes.db",
      }),
      steps: Type.Array(
        Type.Object({
          id: Type.Number({ description: "Step number (1-based)" }),
          title: Type.String({ description: "Step title" }),
          done: Type.Boolean({ description: "Whether this step is complete" }),
          description: Type.Optional(
            Type.String({ description: "Brief description of what this step covers" }),
          ),
        }),
        { description: "Array of steps from start to completion" },
      ),
      questions: Type.Optional(
        Type.Array(
          Type.Object({
            stepId: Type.Number({ description: "Step ID these questions belong to" }),
            questions: Type.Array(Type.String(), {
              description: "Guiding questions for this step",
            }),
          }),
          { description: "Guiding questions per step" },
        ),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const { name, description, steps, questions } = params;
      const cwd = ctx.cwd;
      const relPath = scratchpadRelPath(name);
      const absPath = scratchpadAbsPath(cwd, name);

      const data: ScratchpadData = {
        name,
        description,
        steps,
        questions: questions ?? [],
        searchResults: [],
        milestones: [],
      };

      const content = buildScratchpadFile(data);
      await mkdir(resolve(cwd, "Areas"), { recursive: true });
      await writeFile(absPath, content, "utf-8");

      const indexOk = await registerInDb(cwd, relPath, name, content);

      const indexNote = indexOk
        ? "🗄️ notes.db — registered"
        : "⚠️  File created but DuckDB indexing failed. Will sync on next search.";

      return {
        content: [
          {
            type: "text",
            text: `✅ Scratchpad created: ${relPath}\n${indexNote}\nSteps: ${steps.length} (${steps.filter((s) => s.done).length}/${steps.length} done)\nQuestions: ${(questions ?? []).length} groups`,
          },
        ],
        details: {
          path: relPath,
          absPath,
          name,
          stepCount: steps.length,
          doneCount: steps.filter((s) => s.done).length,
          questionGroups: (questions ?? []).length,
          indexOk,
        },
      };
    },
  });

  // ── Tool 2: update_scratchpad ────────────────────────────────────
  pi.registerTool({
    name: "update_scratchpad",
    label: "Update Scratchpad",
    description:
      "Update an existing roadmap scratchpad: merge new state (steps, questions, search results, milestones) " +
      "into the scratchpad file and refresh the DuckDB index.",
    promptSnippet: "Update a roadmap scratchpad with new state",
    parameters: Type.Object({
      path: Type.String({
        description: "Relative path, e.g. 'Areas/_scratchpad-my-topic.md'",
      }),
      name: Type.Optional(Type.String({ description: "Update scratchpad name" })),
      description: Type.Optional(Type.String({ description: "Update description" })),
      steps: Type.Optional(
        Type.Array(
          Type.Object({
            id: Type.Number(),
            title: Type.String(),
            done: Type.Boolean(),
            description: Type.Optional(Type.String()),
          }),
        ),
      ),
      questions: Type.Optional(
        Type.Array(
          Type.Object({
            stepId: Type.Number(),
            questions: Type.Array(Type.String()),
          }),
        ),
      ),
      searchResults: Type.Optional(
        Type.Array(
          Type.Object({
            stepId: Type.Number(),
            results: Type.Array(
              Type.Object({
                title: Type.String(),
                url: Type.Optional(Type.String()),
                note: Type.Optional(Type.String()),
              }),
            ),
          }),
        ),
      ),
      milestones: Type.Optional(
        Type.Array(
          Type.Object({
            id: Type.Number(),
            name: Type.String(),
            stepIds: Type.Array(Type.Number()),
            done: Type.Boolean(),
            epic: Type.String(),
          }),
        ),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const cwd = ctx.cwd;
      const filePath = resolve(cwd, params.path);

      let existingContent: string;
      try {
        existingContent = await readFile(filePath, "utf-8");
      } catch {
        return {
          content: [{ type: "text", text: `❌ Scratchpad not found at ${params.path}` }],
          details: { error: "FILE_NOT_FOUND" },
        };
      }

      const body = existingContent.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
      const existingData = parseScratchpadBody(body);
      if (!existingData) {
        return {
          content: [{ type: "text", text: `❌ Cannot parse scratchpad JSON from ${params.path}` }],
          details: { error: "INVALID_JSON" },
        };
      }

      const updates: ScratchpadUpdate = {};
      if (params.name !== undefined) updates.name = params.name;
      if (params.description !== undefined) updates.description = params.description;
      if (params.steps !== undefined) updates.steps = params.steps;
      if (params.questions !== undefined) updates.questions = params.questions;
      if (params.searchResults !== undefined) updates.searchResults = params.searchResults;
      if (params.milestones !== undefined) updates.milestones = params.milestones;

      const merged = mergeData(existingData, updates);
      const newContent = buildScratchpadFile(merged);
      await writeFile(filePath, newContent, "utf-8");

      const indexOk = await updateDbIndex(cwd, params.path, merged.name, newContent);

      const doneSteps = merged.steps.filter((s) => s.done).length;
      const indexNote = indexOk
        ? "🗄️ notes.db — updated"
        : "⚠️  File updated but DuckDB re-index failed.";

      return {
        content: [
          {
            type: "text",
            text: `✅ Scratchpad updated: ${params.path}\n${indexNote}\nSteps: ${doneSteps}/${merged.steps.length} done\nQuestions: ${merged.questions.length} groups\nSearch results: ${merged.searchResults.length} steps\nMilestones: ${merged.milestones.length}`,
          },
        ],
        details: {
          path: params.path,
          name: merged.name,
          steps: merged.steps.length,
          doneSteps,
          questions: merged.questions.length,
          searchResults: merged.searchResults.length,
          milestones: merged.milestones.length,
          indexOk,
        },
      };
    },
  });

  // ── Tool 3: delete_scratchpad ────────────────────────────────────
  pi.registerTool({
    name: "delete_scratchpad",
    label: "Delete Scratchpad",
    description:
      "Delete a roadmap scratchpad file from Areas/ and remove all its entries from notes.db.",
    promptSnippet: "Delete a roadmap scratchpad when the task is complete",
    parameters: Type.Object({
      path: Type.String({
        description: "Relative path, e.g. 'Areas/_scratchpad-my-topic.md'",
      }),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const cwd = ctx.cwd;
      const filePath = resolve(cwd, params.path);

      // Delete from DuckDB first
      const { ok: dbDeleted, error: dbError } = await deleteFromDb(cwd, params.path);

      // Delete the file from disk
      try {
        await unlink(filePath);
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        return {
          content: [
            {
              type: "text",
              text: `❌ File not found or could not be deleted: ${filePath}\n${errMsg}`,
            },
          ],
          details: { error: "FILE_DELETE_FAILED", dbDeleted },
        };
      }

      const dbNote = dbDeleted
        ? "🗄️ notes.db — entries removed"
        : `⚠️  DuckDB cleanup: ${dbError ?? "failed"}. The index will sync on next search.`;

      return {
        content: [{ type: "text", text: `🗑️ Scratchpad deleted: ${params.path}\n${dbNote}` }],
        details: { path: params.path, fileDeleted: true, dbDeleted, dbError },
      };
    },
  });
}
