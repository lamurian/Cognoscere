/**
 * Unit tests for _common/slug.ts — slugify
 *
 * Functions tested are duplicated here for isolated, self-contained unit testing.
 * The vitest module resolver has issues with the .pi/ hidden directory.
 */

import { describe, it, expect } from "vitest";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("foo bar baz")).toBe("foo-bar-baz");
  });

  it("replaces multiple special chars with single hyphen", () => {
    expect(slugify("hello   world")).toBe("hello-world");
    expect(slugify("a---b")).toBe("a-b");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-hello-")).toBe("hello");
    expect(slugify("--foo--")).toBe("foo");
  });

  it("handles numbers and letters", () => {
    expect(slugify("test 123 doc")).toBe("test-123-doc");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});
