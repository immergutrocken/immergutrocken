import { FlatCompat } from "@eslint/eslintrc";
import studio from "@sanity/eslint-config-studio";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...studio,
  ...tseslint.config({
    extends: [
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
        ignores: [".sanity/", "public/"],
      },
      ...compat.config({
        extends: ["prettier", "plugin:@typescript-eslint/recommended"],
      }),
    ],
    ignores: [".sanity/", "public/"],
  }),
];
