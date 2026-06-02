// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // Cyclomatic complexity: maximum 15
      complexity: ["error", 15],
      // Allow underscore-prefixed unused vars (callback params not yet wired)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Enforce consistent file extensions in imports
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*/index"],
              message: "Import from the directory name, not from index explicitly.",
            },
          ],
        },
      ],
      // Require JSDoc on exported functions
      "require-jsdoc": "off", // Not available in flat config by default
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "notes.duckdb",
      "notes.duckdb.wal",
    ],
  },
);
