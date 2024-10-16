import { defineArrayMember, defineField, defineType } from 'sanity';

import localizedTabs from '../documents/localizedTabs';
import blockContent from './blockContent';
import { getImage } from './image';

const localizedFields = [
  defineField({
    title: "Titel",
    type: "string",
    name: "title",
    validation: (rule) => rule.required(),
  }),
  defineField({
    ...blockContent,
    title: "Beschreibung",
    name: "description",
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: "Kategorie",
    type: "string",
    name: "category",
    validation: (rule) => rule.required(),
  }),
];

export default defineType({
  title: "Produkt",
  type: "object",
  name: "product",
  preview: {
    select: {
      title: "languages.de.title",
      media: "images.0",
    },
  },
  fields: [
    localizedTabs(localizedFields),
    defineField({
      type: "array",
      name: "images",
      title: "Bilder",
      description:
        'Das oberste Bild wird automatisch als Anzeigebild für das Produkt auf der "Merch"-Seite genutzt',
      of: [defineArrayMember(getImage(false))],
      validation: (rule) => rule.required(),
    }),
  ],
});
