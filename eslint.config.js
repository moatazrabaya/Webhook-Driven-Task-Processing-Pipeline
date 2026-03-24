import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginSecurity from "eslint-plugin-security";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change 'error' to 'warn'
      "@typescript-eslint/no-explicit-any": "off"  // Turn off the 'any' check
    }
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    languageOptions: { 
      // This is the line you need:
      globals: {
        ...globals.node, 
        ...globals.browser // Keep this if you use fetch() as well
      } 
    } 
  },
]);
