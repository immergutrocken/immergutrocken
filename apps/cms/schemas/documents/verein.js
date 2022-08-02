import { slug } from "../fields/slug";
import image, { getImage } from "../fields/image";
import blockContent from "../fields/blockContent";
import expander from "../fields/expander";
import localizedTabs from "./localizedTabs";

const fields = [
  {
    type: "string",
    name: "title",
    title: "Titel",
    validation: (Rule) => Rule.required(),
  },
  {
    ...blockContent,
    of: [...blockContent.of, expander],
    validation: (Rule) => Rule.required(),
  },
];

export default {
  type: "document",
  name: "verein",
  title: "Verein",
  fields: [
    localizedTabs(fields),
    {
      type: "array",
      name: "persons",
      title: "Vereinsmitglieder",
      of: [
        {
          type: "object",
          name: "person",
          title: "Vereinsmitglied",
          fields: [
            { ...getImage(false), validation: (Rule) => Rule.required() },
            {
              type: "string",
              name: "name",
              title: "Name",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
    slug,
    {
      title: "Autor",
      name: "author",
      type: "string",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Verein",
      };
    },
  },
};
