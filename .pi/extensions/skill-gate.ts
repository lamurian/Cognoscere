import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";

// ─── State ───────────────────────────────────────────────────────────────────

const PARA_PATTERNS = [/^Resources\//, /^Projects\//, /^Areas\//];

interface TurnState {
  searchStarted: boolean;
  searchResultCount: number;   // -1 = not done, 0 = empty, >0 = has results
  readParaFiles: Set<string>;  // PARA files read this turn
}

interface SessionState {
  bypassed: boolean;           // user suspended gates via /bypass-gate
  overrideCount: number;       // times user confirmed through a gate this session
  healthy: boolean;            // false = gate crashed, fail-closed
}

let turn: TurnState = freshTurn();
let session: SessionState = freshSession();

function freshTurn(): TurnState {
  return {
    searchStarted: false,
    searchResultCount: -1,
    readParaFiles: new Set(),
  };
}

function freshSession(): SessionState {
  return {
    bypassed: false,
    overrideCount: 0,
    healthy: true,
  };
}

const OVERRIDE_LIMIT = 3;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isParaPath(path: string | undefined): boolean {
  if (!path) return false;
  return PARA_PATTERNS.some((re) => re.test(path));
}

// ─── Extension ───────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  // ── Session / turn lifecycle ─────────────────────────────────────────────

  pi.on("session_start", () => {
    session = freshSession();
    turn = freshTurn();
  });

  pi.on("turn_start", () => {
    turn = freshTurn();
  });

  // ── Bypass command ───────────────────────────────────────────────────────

  pi.registerCommand("bypass-gate", {
    description: "Suspend all skill gates for this session",
    handler: async (_args, ctx) => {
      session.bypassed = true;
      ctx.ui.notify("Skill gates suspended for this session.", "info");
    },
  });

  // ── Track search ─────────────────────────────────────────────────────────

  pi.on("tool_execution_start", (event) => {
    if (event.toolName === "search_para_docs") {
      turn.searchStarted = true;
    }
  });

  pi.on("tool_result", (event) => {
    if (!session.healthy || event.toolName !== "search_para_docs") return;
    try {
      const text = event.content?.[0]?.text ?? "";
      const matches = text.match(/- \[.*?\]\(.*?\)/g);
      turn.searchResultCount = matches ? matches.length : 0;
    } catch {
      turn.searchResultCount = 0;
    }
  });

  // ── Track reads ──────────────────────────────────────────────────────────

  pi.on("tool_call", (event) => {
    if (!session.healthy) return;
    if (!isToolCallEventType("read", event)) return;
    if (isParaPath(event.input.path)) {
      turn.readParaFiles.add(event.input.path);
    }
  });

  // ── Main gate ────────────────────────────────────────────────────────────

  pi.on("tool_call", async (event, ctx) => {
    if (!session.healthy || session.bypassed) return;

    // -- create_para_doc / batch_create_para_docs --

    if (
      isToolCallEventType("create_para_doc", event) ||
      isToolCallEventType("batch_create_para_docs", event)
    ) {
      const action = await gateCreate(ctx);
      if (action === "block") {
        return {
          block: true,
          reason:
            "[skill-gate] Creation blocked. Requirements:\n" +
            "1. Run search_para_docs to check for existing documents.\n" +
            "2. If search returns 0 results and intent is vague, " +
            "read .agents/skills/brainstorm/SKILL.md to clarify.\n" +
            "3. Read .agents/skills/create-doc/SKILL.md before creating.",
        };
      }
    }

    // -- write into PARA dir --

    if (isToolCallEventType("write", event) && isParaPath(event.input.path)) {
      if (!turn.searchStarted) {
        if (!(await confirmOrBlock(ctx, "Write to PARA dir without search?"))) {
          return {
            block: true,
            reason:
              "[skill-gate] Write blocked. Run search_para_docs first to " +
              "check for existing documents. See .agents/skills/knowledge/SKILL.md " +
              "for the standard workflow.",
          };
        }
      }
    }

    // -- edit PARA file --

    if (isToolCallEventType("edit", event) && isParaPath(event.input.path)) {
      if (!turn.readParaFiles.has(event.input.path)) {
        if (!(await confirmOrBlock(ctx, "Edit PARA file without reading?"))) {
          return {
            block: true,
            reason:
              `[skill-gate] Edit blocked. Read "${event.input.path}" first ` +
              "to review current content before making changes.",
          };
        }
      }
    }

    // -- update_para_doc --

    if (isToolCallEventType("update_para_doc", event)) {
      if (!turn.readParaFiles.has(event.input.path)) {
        if (!(await confirmOrBlock(ctx, "Update PARA doc without reading?"))) {
          return {
            block: true,
            reason:
              `[skill-gate] Update blocked. Read "${event.input.path}" first ` +
              "to review current content before updating.",
          };
        }
      }
    }
  });

  // ── Circuit breaker ──────────────────────────────────────────────────────

  process.on("unhandledRejection", (reason) => {
    session.healthy = false;
    console.error("[skill-gate] CRASHED — gate disabled:", reason);
  });
}

// ─── Gate logic ──────────────────────────────────────────────────────────────

async function gateCreate(
  ctx: any,
): Promise<"allow" | "block"> {
  // 1) Was search run this turn?
  if (!turn.searchStarted) {
    if (await confirmOrBlock(ctx, "Create without search?")) {
      session.overrideCount++;
      return "allow";
    }
    return "block";
  }

  // 2) Search is still running (parallel execution) — let it through
  if (turn.searchResultCount === -1) {
    return "allow";
  }

  // 3) Search found existing docs — warn about duplication
  if (turn.searchResultCount > 0) {
    if (await confirmOrBlock(ctx, `Search found ${turn.searchResultCount} existing doc(s). Create anyway?`)) {
      session.overrideCount++;
      return "allow";
    }
    return "block";
  }

  // 4) Search returned 0 results — may need brainstorming
  if (turn.searchResultCount === 0) {
    if (await confirmOrBlock(ctx, "No existing docs found. Create anyway?")) {
      session.overrideCount++;
      return "allow";
    }
    return "block";
  }

  return "allow";
}

// ─── Confirm helper ──────────────────────────────────────────────────────────

async function confirmOrBlock(
  ctx: any,
  label: string,
): Promise<boolean /* true = allow, false = block */> {
  // Headless modes: fail-open (allow)
  if (!ctx.hasUI) return true;

  // Frequency cap: auto-allow after N overrides this session
  if (session.overrideCount >= OVERRIDE_LIMIT) return true;

  try {
    return await ctx.ui.confirm("Skill gate", label);
  } catch {
    return true;
  }
}
