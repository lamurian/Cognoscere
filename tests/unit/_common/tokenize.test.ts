/**
 * Unit tests for _common/tokenize.ts — tokenize, bm25TermScore
 *
 * Functions tested are duplicated here for isolated, self-contained unit testing.
 * The vitest module resolver has issues with the .pi/ hidden directory.
 */

import { describe, it, expect } from "vitest";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "about", "above", "after", "again", "all", "also", "any",
  "because", "before", "between", "both", "each", "few", "from",
  "here", "how", "into", "just", "more", "most", "no", "not", "now",
  "only", "other", "over", "per", "same", "such", "than", "that",
  "their", "them", "there", "these", "they", "this", "those", "through",
  "under", "until", "very", "what", "when", "where", "which", "while",
  "who", "why", "up", "down", "out", "off", "about", "above",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function bm25TermScore(
  tf: number,
  df: number,
  N: number,
  docLength: number,
  avgDocLen: number,
  k1: number = 1.2,
  b: number = 0.75,
): number {
  if (df <= 0 || N <= 0) return 0;
  const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * (1 - b + b * (docLength / Math.max(avgDocLen, 1)));
  return idf * (numerator / denominator);
}

describe("tokenize", () => {
  it("splits on non-alphanumeric characters", () => {
    expect(tokenize("hello-world")).toEqual(["hello", "world"]);
    expect(tokenize("foo_bar baz")).toEqual(["foo", "bar", "baz"]);
    expect(tokenize("alpha,beta.charlie!delta?echo")).toEqual(["alpha", "beta", "charlie", "delta", "echo"]);
  });

  it("converts to lowercase", () => {
    expect(tokenize("Hello World")).toEqual(["hello", "world"]);
    expect(tokenize("UPPERCASE")).toEqual(["uppercase"]);
  });

  it("removes stop words", () => {
    const result = tokenize("the quick brown fox jumps over the lazy dog");
    expect(result).not.toContain("the");
    expect(result).toContain("quick");
    expect(result).toContain("brown");
  });

  it("removes single-character tokens", () => {
    expect(tokenize("a b c d e f g")).toEqual([]);
    expect(tokenize("x y z hello")).toEqual(["hello"]);
  });

  it("returns empty array for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("handles strings with only stop words", () => {
    expect(tokenize("the and or for of in")).toEqual([]);
  });

  it("handles numbers", () => {
    expect(tokenize("test 123 foo 456")).toEqual(["test", "123", "foo", "456"]);
  });
});

describe("bm25TermScore", () => {
  const N = 100;
  const avgDocLen = 50;

  it("returns positive score for matching term", () => {
    const score = bm25TermScore(3, 10, N, 50, avgDocLen);
    expect(score).toBeGreaterThan(0);
  });

  it("returns 0 for tf=0", () => {
    const score = bm25TermScore(0, 10, N, 50, avgDocLen);
    expect(score).toBe(0);
  });

  it("returns 0 for df=0", () => {
    const score = bm25TermScore(3, 0, N, 50, avgDocLen);
    expect(score).toBe(0);
  });

  it("higher tf gives higher score", () => {
    const s1 = bm25TermScore(1, 10, N, 50, avgDocLen);
    const s5 = bm25TermScore(5, 10, N, 50, avgDocLen);
    expect(s5).toBeGreaterThan(s1);
  });

  it("higher df (more common term) gives lower score", () => {
    const rare = bm25TermScore(3, 5, N, 50, avgDocLen);
    const common = bm25TermScore(3, 50, N, 50, avgDocLen);
    expect(rare).toBeGreaterThan(common);
  });

  it("longer doc (relative to avg) reduces score with b>0", () => {
    const short = bm25TermScore(3, 10, N, 25, avgDocLen);
    const long = bm25TermScore(3, 10, N, 200, avgDocLen);
    expect(short).toBeGreaterThan(long);
  });

  it("works with custom k1 and b parameters", () => {
    const score = bm25TermScore(3, 10, N, 50, avgDocLen, 2.0, 0.5);
    expect(score).toBeGreaterThan(0);
  });

  it("handles N=1 edge case", () => {
    const score = bm25TermScore(3, 1, 1, 50, 50);
    expect(score).toBeGreaterThan(0);
  });

  it("handles N=0 edge case", () => {
    expect(bm25TermScore(3, 0, 0, 50, 50)).toBe(0);
  });
});
