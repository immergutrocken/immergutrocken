import { defineField, Path, SlugSourceFn } from 'sanity';

export const slug = (source: string | Path | SlugSourceFn | undefined) =>
  defineField({
    title: "Slug",
    name: "slug",
    type: "slug",
    options: {
      source: source,
    },
    validation: (Rule) => Rule.required(),
  });

export default slug("languages.de.title");
