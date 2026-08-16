import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // design-sync: generated output and staged third-party scripts, never
    // hand-edited. ds-bundle/ holds the compiled bundle, vendored React and
    // compiled previews; .ds-sync/ is the converter copied in from the skill.
    // The hand-written sync inputs under .design-sync/ ARE linted.
    "ds-bundle/**",
    ".ds-sync/**",
    ".design-sync/.cache/**",
  ]),
]);

export default eslintConfig;
