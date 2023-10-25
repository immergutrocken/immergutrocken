export const slug = (source) => ({
  title: "Slug",
  name: "slug",
  type: "slug",
  options: {
    source: source,
  },
  validation: (Rule) => Rule.required(),
});

export default slug("languages.de.title");
