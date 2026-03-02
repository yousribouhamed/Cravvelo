import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const customConfig = require("eslint-config-custom");

const eslintConfig = [
  ...compat.config(customConfig),
  {
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/.cache/**",
    ],
  },
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
    },
  },
];

export default eslintConfig;
