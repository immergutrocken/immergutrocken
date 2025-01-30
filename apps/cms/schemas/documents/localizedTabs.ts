import { defineField } from "sanity";

import supportedLanguages from "../../supportedLanguages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildFields = (fields: any[]) =>
  supportedLanguages.map((lang) =>
    defineField({
      type: "object",
      name: lang.id,
      title: lang.title,
      fields: fields,
      group: lang.id,
    }),
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (fields: any[]) =>
  defineField({
    name: "languages",
    title: "",
    type: "object",
    groups: supportedLanguages.map((lang) => ({
      name: lang.id,
      title: lang.title,
    })),
    fields: buildFields(fields),
  });
