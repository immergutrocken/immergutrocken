import { GiFiles } from "react-icons/gi";
import { RiArticleLine } from "react-icons/ri";
import { defineArrayMember, defineField, defineType } from "sanity";

import blockContent from "../fields/blockContent";
import contactForm from "../fields/contactForm";
import expander from "../fields/expander";
import image from "../fields/image";
import slug from "../fields/slug";
import localizedTabs from "./localizedTabs";

const fields = [
  defineField({
    type: "string",
    name: "title",
    title: "Titel",
    validation: (rule) => rule.required(),
  }),
  defineField({
    type: "string",
    name: "subtitle",
    title: "Untertitel",
  }),
  defineField({
    ...image,
    title: "Banner",
    name: "banner",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    ...blockContent,
    of: [
      ...blockContent.of,
      contactForm,
      expander,
      defineArrayMember({
        type: "object",
        name: "articleGallery",
        title: "Artikel Galerie",
        icon: GiFiles,
        fields: [
          defineField({
            type: "array",
            name: "articles",
            title: "Artikel",
            of: [
              defineArrayMember({
                type: "reference",
                to: [{ type: "article" }],
              }),
            ],
          }),
        ],
        preview: {
          select: {
            article0: "articles.0.languages.de.title",
            article1: "articles.1.languages.de.title",
            article2: "articles.2.languages.de.title",
            article3: "articles.3.languages.de.title",
          },
          prepare({ article0, article1, article2, article3 }) {
            const articles = [article0, article1, article2, article3].filter(
              Boolean,
            );
            return {
              title: articles.join(", "),
            };
          },
        },
      }),
    ],
    validation: (rule) => rule.required(),
  }),
];

export default defineType({
  type: "document",
  name: "article",
  icon: RiArticleLine,
  title: "Artikel",
  fields: [
    localizedTabs(fields),
    slug,
    {
      title: "Open Graph Beschreibung",
      name: "ogDescription",
      type: "string",
      validation: (rule) => rule.required().max(120),
      description: "Wird für die Vorschau von Links benutzt",
    },
    {
      title: "Autor",
      name: "author",
      type: "string",
    },
    {
      title: "News",
      name: "isNews",
      type: "boolean",
    },
  ],
  preview: {
    select: {
      title: "languages.de.title",
      subtitle: "languages.de.subtitle",
      media: "languages.de.banner",
    },
  },
  initialValue: {
    isNews: true,
  },
});
