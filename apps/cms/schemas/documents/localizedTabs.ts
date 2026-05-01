import { defineField } from "sanity";

import supportedLanguages from "../../supportedLanguages";

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
