import { defineField } from 'sanity';

export default (references: string[]) =>
  defineField({
    name: "link",
    type: "object",
    title: "Link",
    fields: [
      defineField({
        title: "CTA",
        name: "isCTA",
        type: "boolean",
        validation: (rule) => rule.required(),
      }),
      {
        name: "reference",
        type: "reference",
        title: "Reference",
        to: references.map((reference) => ({ type: reference })),
      },
      defineField({
        name: "href",
        type: "url",
        title: "URL",
      }),
      defineField({
        title: "Open in new tab",
        name: "blank",
        type: "boolean",
      }),
    ],
  });
