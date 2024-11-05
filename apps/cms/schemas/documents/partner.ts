import { RiGiftLine } from 'react-icons/ri';
import { defineField, defineType } from 'sanity';

import externalLink from '../fields/externalLink';
import image from '../fields/image';

export default defineType({
  type: "document",
  name: "partner",
  title: "Partner",
  icon: RiGiftLine,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Titel",
    }),
    defineField({
      type: "string",
      name: "category",
      title: "Kategorie",
      options: {
        list: [
          { title: "Sponsor", value: "sponsor" },
          { title: "Medienpartner", value: "media-partner" },
          { title: "Außerdem", value: "additional" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      ...image,
      name: "logo",
      title: "Logo",
      fields: [
        ...(image.fields ?? []),
        defineField({
          type: "number",
          name: "height",
          title: "Höhe",
          description: "in Pixel",
          validation: (rule) => rule.required().integer().positive(),
        }),
        defineField({
          type: "number",
          name: "width",
          title: "Breite",
          description: "in Pixel",
          validation: (rule) => rule.required().integer().positive(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({ ...externalLink, title: "Link" }),
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
});
