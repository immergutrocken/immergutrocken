import { defineField } from "sanity";

import localeString from "./localeString";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withTitle = (object: any) => ({
  ...object,
  fields: [defineField(localeString("Titel", "title")), ...object.fields],
  preview: {
    select: {
      title: "title.de",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withCTA = (object: any) => ({
  ...object,
  fields: [
    defineField({
      title: "CTA",
      name: "isCTA",
      type: "boolean",
    }),
    ...object.fields,
  ],
});
