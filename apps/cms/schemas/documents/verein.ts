import { defineField, defineType } from 'sanity';

import blockContent from '../fields/blockContent';
import expander from '../fields/expander';
import { getImage } from '../fields/image';
import localizedTabs from './localizedTabs';

const fields = [
  defineField({
    type: "string",
    name: "title",
    title: "Titel",
    validation: (rule) => rule.required(),
  }),
  defineField({
    ...blockContent,
    of: [...blockContent.of, expander],
    validation: (rule) => rule.required(),
  }),
];

export default defineType({
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
});
