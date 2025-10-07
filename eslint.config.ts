import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
    {
        rules: {
            "no-unassigned-vars": "error",
            "no-unused-vars": "error",
            "use-isnan": "error",
            "capitalized-comments": "warn",
            "prefer-const": "error",
        },
    },
]);
