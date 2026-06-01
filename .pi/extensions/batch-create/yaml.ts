/**
 * YAML frontmatter helpers for PARA documents.
 */

const FIELD_ORDER = ["title", "description", "author", "editor", "date", "tags", "source"] as const;

/** Slugify a title to a safe filename. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Quote a YAML value if it contains special characters. */
export function yamlQuote(value: string): string {
  if (value.length === 0) return "''";
  // Leading special chars that need quoting
  if (/^[[\]{},&*!|>'"%@`#:?-\s]/.test(value)) return `'${value}'`;
  if (/: /.test(value) || / #/.test(value)) return `'${value}'`;
  if (/^(true|false|yes|no|on|off|null|undefined|~)$/i.test(value)) return `'${value}'`;
  if (/^\d+(\.\d+)?$/.test(value)) return `'${value}'`;
  return value;
}

/** Build standardised YAML frontmatter string from a fields map. */
export function formatFrontmatter(fields: Record<string, unknown>): string {
  let out = "---\n";
  let sourceVal: string | undefined;
  if (typeof fields.source === "string" && fields.source) sourceVal = fields.source;
  else if (typeof fields.source_url === "string" && fields.source_url)
    sourceVal = fields.source_url;

  for (const key of FIELD_ORDER) {
    if (key === "tags") {
      const v = fields.tags;
      if (Array.isArray(v) && v.length > 0) {
        out += "tags:\n";
        for (const t of v) out += `  - ${yamlQuote(String(t))}\n`;
      }
    } else if (key === "source") {
      if (sourceVal) out += `source: ${yamlQuote(sourceVal)}\n`;
    } else {
      const v = fields[key];
      if (typeof v === "string" && v) out += `${key}: ${yamlQuote(v)}\n`;
    }
  }
  return out + "---\n";
}

/** Lightweight tokenizer for BM25 term extraction. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}
