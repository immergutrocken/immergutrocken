import { defineArrayMember, defineField, defineType } from 'sanity';

const getPartnerReferenceArray = (options: {
  category: string;
  name: string;
  title: string;
}) =>
  defineField({
    type: "array",
    name: options.name,
    title: options.title,
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: "partner" }],
        options: {
          filter: "category == $category",
          filterParams: {
            category: options.category,
          },
        },
      }),
    ],
  });

export default defineType({
  name: "sortings",
  type: "document",
  title: "Sortierungen",
  fields: [
    defineField({
      type: "array",
      name: "artists",
      title: "Künstler",
      options: {
        modal: { type: "popover" },
      },
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "artist" }],
        }),
      ],
    }),
    defineField({
      type: "array",
      name: "news",
      title: "News",
      options: {
        modal: { type: "popover" },
      },
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "article" }],
          options: {
            filter: "isNews == $isNews",
            filterParams: { isNews: true },
          },
        }),
      ],
    }),
    getPartnerReferenceArray({
      category: "sponsor",
      name: "sponsors",
      title: "Sponsoren",
    }),
    getPartnerReferenceArray({
      category: "media-partner",
      name: "mediaPartner",
      title: "Medienpartner",
    }),
    getPartnerReferenceArray({
      category: "additional",
      name: "additionalPartner",
      title: "Andere Partner (Außerdem)",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Sortierungen",
      };
    },
  },
});
