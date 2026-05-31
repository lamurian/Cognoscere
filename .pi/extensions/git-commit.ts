/**
 * Git Commit Extension
 *
 * Provides `/commit` slash command that:
 * 1. Runs `git add --all`
 * 2. Runs `git commit -m` with a short auto-generated message
 * 3. Never pushes
 */

import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerCommand("commit", {
		description: "Stage all changes and commit with an auto-generated message (no push)",
		handler: async (_args: string, ctx: ExtensionCommandContext) => {
			// 1. Check if we're in a git repo
			const { code: repoCheck } = await pi.exec("git", ["rev-parse", "--git-dir"]);
			if (repoCheck !== 0) {
				ctx.ui.notify("Not a git repository", "error");
				return;
			}

			// 2. Check for uncommitted changes
			const { stdout: status } = await pi.exec("git", ["status", "--porcelain"]);
			if (status.trim().length === 0) {
				ctx.ui.notify("No changes to commit", "info");
				return;
			}

			// 3. Stage all changes
			ctx.ui.notify("Staging all changes...", "info");
			const { code: addCode } = await pi.exec("git", ["add", "--all"]);
			if (addCode !== 0) {
				ctx.ui.notify("Failed to stage changes", "error");
				return;
			}

			// 4. Generate a short commit message from the staged diff
			const { stdout: diffStat } = await pi.exec("git", ["diff", "--cached", "--stat"]);
			const { stdout: diffSummary } = await pi.exec("git", [
				"diff",
				"--cached",
				"--compact-summary",
			]);

			const message = generateCommitMessage(diffStat, diffSummary);

			// 5. Commit
			const { code: commitCode, stderr: commitErr } = await pi.exec("git", [
				"commit",
				"-m",
				message,
			]);

			if (commitCode === 0) {
				const { stdout: shortHash } = await pi.exec("git", [
					"log",
					"--format=%h",
					"-1",
				]);
				ctx.ui.notify(
					`Committed ${shortHash.stdout.trim()}: ${message}`,
					"success",
				);
			} else {
				ctx.ui.notify(
					`Commit failed: ${commitErr.trim() || "unknown error"}`,
					"error",
				);
			}
		},
	});
}

/**
 * Generate a short, meaningful commit message from git diff output.
 */
function generateCommitMessage(diffStat: string, diffSummary: string): string {
	const lines = diffStat.trim().split("\n").filter(Boolean);

	if (lines.length === 0) {
		return "chore: update files";
	}

	// Parse changed files from diff stat (format: " path/to/file | changes ")
	const files = lines
		.map((line) => {
			const match = line.match(/^\s+(.+?)\s+\|/);
			return match ? match[1] : null;
		})
		.filter(Boolean) as string[];

	if (files.length === 0) {
		return "chore: update files";
	}

	// Try to determine the type of change
	const types = new Set<string>();
	const paths = new Set<string>();
	let hasNewFiles = false;
	let hasDeletedFiles = false;
	let hasRenamedFiles = false;

	const summaryLines = diffSummary.trim().split("\n").filter(Boolean);
	for (const line of summaryLines) {
		if (line.includes("new file")) hasNewFiles = true;
		if (line.includes("deleted")) hasDeletedFiles = true;
		if (line.includes("rename")) hasRenamedFiles = true;
	}

	// Classify by file ending / prefix
	for (const file of files) {
		if (file.startsWith(".")) continue;
		if (file.endsWith(".md")) types.add("docs");
		else if (
			file.endsWith(".ts") ||
			file.endsWith(".js") ||
			file.endsWith(".tsx") ||
			file.endsWith(".jsx")
		) {
			types.add("code");
		} else if (
			file.endsWith(".json") ||
			file.endsWith(".yaml") ||
			file.endsWith(".yml")
		) {
			types.add("config");
		} else if (
			file.endsWith(".png") ||
			file.endsWith(".jpg") ||
			file.endsWith(".svg")
		) {
			types.add("assets");
		}

		// Track top-level directory for context
		const parts = file.split("/");
		if (parts.length >= 2) {
			paths.add(parts[0]);
		}
	}

	// Build message
	if (hasNewFiles && files.length === 1) {
		return `feat: add ${files[0]}`;
	}
	if (hasDeletedFiles && files.length === 1) {
		return `chore: remove ${files[0]}`;
	}
	if (hasRenamedFiles && files.length === 1) {
		return `chore: rename ${files[0]}`;
	}

	// Single file
	if (files.length === 1) {
		const file = files[0];
		const filename = file.split("/").pop() || file;
		if (hasNewFiles) return `feat: add ${filename}`;
		if (hasDeletedFiles) return `chore: remove ${filename}`;
		return `update: ${filename}`;
	}

	// Multiple files - use type prefix
	const pathList = Array.from(paths);
	const typeList = Array.from(types);
	const fileCount = files.length;

	if (typeList.length === 1) {
		const prefix = typeList[0] === "docs"
			? "docs"
			: typeList[0] === "config"
				? "chore"
				: "update";
		const scope = pathList.length <= 2 ? pathList.join("/") : `${pathList[0]}/...`;
		return `${prefix}(${scope}): update ${fileCount} file${fileCount > 1 ? "s" : ""}`;
	}

	// Mixed changes
	if (pathList.length <= 2) {
		return `update(${pathList.join("/")}): ${fileCount} file${fileCount > 1 ? "s" : ""} changed`;
	}

	return `update: ${fileCount} file${fileCount > 1 ? "s" : ""} changed across ${pathList.length} areas`;
}
