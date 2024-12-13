import { defineField, defineType } from "sanity";

import blockContent from "../fields/blockContent";
import product from "../fields/product";
import localizedTabs from "./localizedTabs";

const localizedFields = [
  defineField({
    ...blockContent,
    title: "Beschreibung",
    name: "description",
    validation: (rule) => rule.required(),
  }),
];

export default defineType({
  type: "document",
  name: "merch",
  title: "merch",
  fields: [
    localizedTabs(localizedFields),
    defineField({
      title: "Slug",
      name: "slug",
      type: "slug",
      hidden: () => true,
      initialValue: { current: "merch" },
    }),
    defineField({
      type: "array",
      name: "products",
      title: "Produkte",
      of: [product],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Merch",
      };
    },
  },
});
