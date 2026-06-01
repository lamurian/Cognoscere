/**
 * Shared types for roadmap scratchpad state.
 *
 * Each scratchpad is a PARA document in Areas/ with a JSON body containing
 * the full roadmap state (steps, questions, search results, milestones).
 */

export interface Step {
  id: number;
  title: string;
  done: boolean;
  description?: string;
}

export interface StepQuestions {
  stepId: number;
  questions: string[];
}

export interface SearchResultItem {
  title: string;
  url?: string;
  note?: string;
}

export interface StepSearchResults {
  stepId: number;
  results: SearchResultItem[];
}

export interface Milestone {
  id: number;
  name: string;
  stepIds: number[];
  done: boolean;
  epic: string;
}

export interface ScratchpadData {
  name: string;
  description: string;
  steps: Step[];
  questions: StepQuestions[];
  searchResults: StepSearchResults[];
  milestones: Milestone[];
}

/** Partial update payload (all fields optional). */
export interface ScratchpadUpdate {
  name?: string;
  description?: string;
  steps?: Step[];
  questions?: StepQuestions[];
  searchResults?: StepSearchResults[];
  milestones?: Milestone[];
}
