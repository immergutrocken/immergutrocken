import { defineField } from "sanity";

import supportedLanguages from "../../supportedLanguages";

type FieldDef = ReturnType<typeof defineField>;

const buildFields = (fields: FieldDef[]) =>
  supportedLanguages.map((lang) =>
    defineField({
      type: "object",
      name: lang.id,
      title: lang.title,
      fields: fields,
      group: lang.id,
    }),
  );

export default (fields: FieldDef[]) =>
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
