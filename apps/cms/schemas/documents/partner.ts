import { RiGiftLine } from "react-icons/ri";
import externalLink from "../fields/externalLink";
import image from "../fields/image";

export default {
  type: "document",
  name: "partner",
  title: "Partner",
  icon: RiGiftLine,
  fields: [
    {
      type: "string",
      name: "title",
      title: "Titel",
    },
    {
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
    },
    {
      ...image,
      name: "logo",
      title: "Logo",
      fields: [
        ...image.fields,
        {
          type: "number",
          name: "height",
          title: "Höhe",
          description: "in Pixel",
          validation: (Rule) => Rule.required().integer().positive(),
        },
        {
          type: "number",
          name: "width",
          title: "Breite",
          description: "in Pixel",
          validation: (Rule) => Rule.required().integer().positive(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    { ...externalLink, title: "Link" },
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
};
