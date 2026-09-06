import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["build/**"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // only the import rules this project configures - tsc already catches
    // unresolved imports, and the plugin's resolver can't read exports maps
    plugins: { import: importPlugin },
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: { ecmaVersion: 2020, sourceType: "module" },
    },
    rules: {
      "no-var": "warn",
      "getter-return": "warn",
      "no-empty": "warn",
      "@typescript-eslint/no-empty-function": [
        "warn",
        { allow: ["arrowFunctions"] },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-template-curly-in-string": "warn",
      "array-callback-return": "warn",
      "dot-notation": "warn",
      "no-throw-literal": "warn",
      "prefer-regex-literals": "warn",
      "require-await": "warn",
      "object-shorthand": "warn",
      "no-unneeded-ternary": "warn",
      eqeqeq: ["warn", "smart"],
      "prefer-const": ["warn", { destructuring: "all" }],
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc" },
          groups: ["builtin", "external", "parent", "sibling", "index"],
        },
      ],
      "import/no-anonymous-default-export": ["warn", { allowObject: true }],
      "import/newline-after-import": ["warn", { count: 1 }],
    },
  }
);
