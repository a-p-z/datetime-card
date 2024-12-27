import eslint from "@eslint/js";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended, // ESLint Javascript base rules
  ...tseslint.configs.recommended, // ESLint Typescript base rules
  ...sveltePlugin.configs["flat/recommended"],
  {
    files: ["**/*.svelte", "*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: {
          ts: "@typescript-eslint/parser",
        },
        extraFileExtensions: [".svelte"],
      },
      globals: {
        input: "readonly",
        window: "readonly",
        document: "readonly",
        HTMLInputElement: "readonly",
        setTimeout: "readonly",
        CustomEvent: "readonly",
      },
    },
  },
  {
    files: ["**/*.svelte.ts", "*.svelte.ts"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.svelte.js", "*.svelte.js"],
    languageOptions: {
      parser: svelteParser,
    },
  },
  {
    // Globally ignore the dist directory.
    ignores: ["dist/*"],
  },
);
