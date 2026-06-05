/**
 * Scope Gate Extension
 *
 * Enforces path-scoped file access for write/edit/read tools:
 * - Blocks writes/edits outside the current working directory
 * - Blocks writes/edits to .gitignored files (via `git check-ignore`)
 * - Blocks reads of .env / *.env.* files, except .env.example
 * - Blocks reads of files outside the working directory
 *
 * Works alongside the OS-level sandbox (which handles bash).
 */

import { execSync } from "node:child_process";
import { resolve, relative, basename } from "node:path";
import { homedir } from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Expand leading ~/ (or just ~) to the home directory. */
function expandTilde(path: string): string {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return resolve(homedir(), path.slice(2));
  return path;
}

function isInsideCwd(cwd: string, targetPath: string): boolean {
  const rel = relative(cwd, targetPath);
  return !rel.startsWith("..") && !resolve(targetPath).startsWith(cwd);
}

function isGitIgnored(cwd: string, targetPath: string): boolean {
  try {
    const relPath = relative(cwd, targetPath);
    if (!relPath || relPath.startsWith("..")) return false;
    const result = execSync("git check-ignore -q " + JSON.stringify(relPath), {
      cwd,
      stdio: ["ignore", "ignore", "ignore"],
      timeout: 3000,
    });
    return true; // exit code 0 = ignored
  } catch {
    return false; // exit code 1 = not ignored, or not a git repo
  }
}

function isEnvFile(fileName: string): boolean {
  return fileName === ".env" || /^\.env\..+$/.test(fileName);
}

function isEnvExample(fileName: string): boolean {
  return fileName === ".env.example";
}

// ─── Extension ───────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    // ── Write / Edit tools ──────────────────────────────────────────────
    if (event.toolName === "write" || event.toolName === "edit") {
      const targetPath = resolve(ctx.cwd, expandTilde(event.input.path));
      const relPath = relative(ctx.cwd, targetPath);
      const fileName = basename(targetPath);

      // Block writes outside cwd
      if (relPath.startsWith("..")) {
        return {
          block: true,
          reason: `Path "${relPath}" is outside the working directory (${ctx.cwd}). Writes are scoped to the repo.`,
        };
      }

      // Block writes to .env / .env.* files (except .env.example)
      if (isEnvFile(fileName) && !isEnvExample(fileName)) {
        return {
          block: true,
          reason: `Writing to "${relPath}" is not allowed — protected environment file.`,
        };
      }

      // Block writes to .gitignored files
      if (isGitIgnored(ctx.cwd, targetPath)) {
        if (ctx.hasUI) {
          ctx.ui.notify(`Blocked write to gitignored file: ${relPath}`, "warning");
        }
        return {
          block: true,
          reason: `Path "${relPath}" is in .gitignore. Write blocked.`,
        };
      }
    }

    // ── Read tool ────────────────────────────────────────────────────────
    if (event.toolName === "read") {
      const targetPath = resolve(ctx.cwd, expandTilde(event.input.path));
      const relPath = relative(ctx.cwd, targetPath);
      const fileName = basename(targetPath);

      // Block reads outside cwd
      if (relPath.startsWith("..")) {
        return {
          block: true,
          reason: `Path "${relPath}" is outside the working directory (${ctx.cwd}). Reads are scoped to the repo.`,
        };
      }

      // Allow .env.example explicitly
      if (isEnvExample(fileName)) return;

      // Block reads of .env and *.env.* files
      if (isEnvFile(fileName)) {
        if (ctx.hasUI) {
          ctx.ui.notify(`Blocked read of sensitive file: ${relPath}`, "warning");
        }
        return {
          block: true,
          reason: `Reading "${relPath}" is not allowed — sensitive environment file.`,
        };
      }
    }
  });
}
