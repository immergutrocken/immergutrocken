export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
  },
  {
    ignores: [
      ".sanity/",
      "node_modules/",
      "dist/",
      "build/",
      "**/*.ts",
      "**/*.tsx",
    ],
  },
];
