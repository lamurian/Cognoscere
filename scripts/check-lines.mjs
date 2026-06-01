#!/usr/bin/env node

/**
 * check-lines.mjs
 *
 * Verifies that all .ts files under .pi/extensions/ stay within the
 * 300-line limit (including blank lines and comments).
 * Exits with code 1 if any file exceeds the limit.
 *
 * Usage: node scripts/check-lines.mjs [--staged]
 *   --staged: only check files that are staged in git
 */

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const MAX_LINES = 300;
const EXTENSIONS_DIR = ".pi/extensions";

function getFiles() {
  const isStaged = process.argv.includes("--staged");
  if (isStaged) {
    const output = execSync(
      "git diff --cached --name-only --diff-filter=ACM",
      { encoding: "utf-8" },
    );
    return output
      .trim()
      .split("\n")
      .filter((f) => f.startsWith(EXTENSIONS_DIR) && f.endsWith(".ts"));
  }
  const output = execSync(
    `find ${EXTENSIONS_DIR} -name '*.ts' -type f`,
    { encoding: "utf-8" },
  );
  return output.trim().split("\n").filter(Boolean);
}

function main() {
  const files = getFiles();

  if (files.length === 0) {
    console.log("✅ No .ts files to check.");
    process.exit(0);
  }

  let hasError = false;

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");
    const lineCount = lines.length;

    if (lineCount > MAX_LINES) {
      console.error(`❌ ${file}: ${lineCount} lines (max ${MAX_LINES})`);
      hasError = true;
    } else {
      console.log(`✅ ${file}: ${lineCount} lines`);
    }
  }

  if (hasError) {
    console.error(
      `\n❌ Some files exceed the ${MAX_LINES}-line limit. Refactor into smaller modules.`,
    );
    process.exit(1);
  }

  console.log(`\n✅ All ${files.length} file(s) within ${MAX_LINES}-line limit.`);
}

main();
