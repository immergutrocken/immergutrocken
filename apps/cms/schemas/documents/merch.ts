import blockContent from "../fields/blockContent";
import product from "../fields/product";
import localizedTabs from "./localizedTabs";

const localizedFields = [
  {
    ...blockContent,
    title: "Beschreibung",
    name: "description",
    validation: (Rule) => Rule.required(),
  },
]

export default {
  type: 'document',
  name: 'merch',
  title: 'merch',
  fields: [
    localizedTabs(localizedFields),
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      hidden: () => true,
      initialValue: { current: 'merch' },
    },
    {
      'type': 'array',
      'name': 'products',
      'title': 'Produkte',
      'of': [product]
    }
  ],
  preview: {
    prepare() {
      return {
        title: "Merch",
      };
    },
  },
}