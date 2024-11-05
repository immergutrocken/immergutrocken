import { defineField, Path, SlugSourceFn } from 'sanity';

export const slug = (source: string | Path | SlugSourceFn | undefined) =>
  defineField({
    title: "Slug",
    name: "slug",
    type: "slug",
    options: {
      source: source,
    },
    validation: (rule) => rule.required(),
  });

export default slug("languages.de.title");
