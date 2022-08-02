export default (references) => ({
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    {
      title: "CTA",
      name: "isCTA",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "reference",
      type: "reference",
      title: "Reference",
      to: references.map((reference) => ({ type: reference })),
    },
    {
      name: "href",
      type: "url",
      title: "URL",
    },
    {
      title: "Open in new tab",
      name: "blank",
      type: "boolean",
    },
  ],
});
