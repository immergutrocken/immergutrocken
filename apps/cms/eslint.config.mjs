// @ts-check
import studio from "@sanity/eslint-config-studio";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  ...studio,
  prettier,
  {
    ignores: [".sanity/*"],
  },
];
