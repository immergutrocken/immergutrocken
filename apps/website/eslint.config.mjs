// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config({
  extends: [
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    ...compat.config({
      extends: [
        "next",
        "next/core-web-vitals",
        "next/typescript",
        "prettier",
        "plugin:@typescript-eslint/recommended",
      ],
    }),
  ],
});
