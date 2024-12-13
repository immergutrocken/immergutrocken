import { defineField } from 'sanity';

import localeString from './localeString';

export const withTitle = (object: any) => ({
  ...object,
  fields: [defineField(localeString("Titel", "title")), ...object.fields],
  preview: {
    select: {
      title: "title.de",
    },
  },
});

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
