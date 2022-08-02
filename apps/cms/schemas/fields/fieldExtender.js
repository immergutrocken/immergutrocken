import localeString from "../fields/localeString";

export const withTitle = (object) => ({
  ...object,
  fields: [localeString("Titel", "title"), ...object.fields],
  preview: {
    select: {
      title: "title.de",
    },
  },
});

export const withCTA = (object) => ({
  ...object,
  fields: [
    {
      title: "CTA",
      name: "isCTA",
      type: "boolean",
    },
    ...object.fields,
  ],
});
