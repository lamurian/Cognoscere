/**
 * Git Commit Extension
 *
 * Provides `/commit` slash command that:
 * 1. Runs `git add --all`
 * 2. Shows the staged diff to the agent
 * 3. Lets the agent generate a descriptive commit message and commit
 * 4. Never pushes
 */

import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";

/**
 * Maximum diff size (in chars) to send to the agent. If the diff is larger,
 * we send a truncated version with a note.
 */
const MAX_DIFF_SIZE = 20_000;

export default function (pi: ExtensionAPI) {
  pi.registerCommand("commit", {
    description: "Stage all changes and let the agent write a commit message (no push)",
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

      // 4. Get the staged diff and file list
      const { stdout: patchOutput } = await pi.exec("git", ["diff", "--cached", "--patch"]);
      const { stdout: statOutput } = await pi.exec("git", ["diff", "--cached", "--stat"]);

      let diffContent = patchOutput.trim();
      if (!diffContent) {
        // --patch may be empty for binary files, symlinks, etc.
        // Fall back to --name-status to at least show what happened to each file.
        const { stdout: fallback } = await pi.exec("git", ["diff", "--cached", "--name-status"]);
        diffContent = fallback.trim() || "(staged changes — no diff content available)";
      }

      const changedFiles = statOutput.trim();

      // 5. Hand off to the agent — let it read the diff and write the commit
      const diffSection =
        diffContent.length > MAX_DIFF_SIZE
          ? `The diff is too large to show in full (${diffContent.length} chars). Here is the last ${MAX_DIFF_SIZE} chars:\n\n${diffContent.slice(-MAX_DIFF_SIZE)}`
          : diffContent;

      const message = [
        "The changes below have been staged (`git add --all`).",
        "",
        "```",
        changedFiles,
        "```",
        "",
        "```diff",
        diffSection,
        "```",
        "",
        "Please review the changes above, then write a **descriptive commit message**",
        "following conventional commits format (e.g. `feat:`, `docs:`, `fix:`, `chore:`)",
        'and run `git commit -m "..."` to commit them.',
        "",
        "Do NOT push.",
      ].join("\n");

      // Notify the user, then hand off to the agent
      ctx.ui.notify("Handing diff to agent to write commit message...", "info");
      await pi.sendUserMessage(message);
    },
  });
}
