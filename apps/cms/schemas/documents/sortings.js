export default {
  name: "sortings",
  type: "document",
  title: "Sortierungen",
  __experimental_actions: ["create", "update", /*'delete',*/ "publish"],
  fields: [
    {
      type: "array",
      name: "artists",
      title: "Künstler",
      options: {
        modal: "popover",
      },
      of: [
        {
          type: "reference",
          to: [{ type: "artist" }],
        },
      ],
    },
    {
      type: "array",
      name: "news",
      title: "News",
      options: {
        modal: "popover",
      },
      of: [
        {
          type: "reference",
          to: [{ type: "article" }],
          options: {
            filter: "isNews == $isNews",
            filterParams: { isNews: true },
          },
        },
      ],
    },
    {
      type: "array",
      name: "sponsors",
      title: "Sponsoren",
      of: [
        {
          type: "reference",
          to: [{ type: "partner" }],
          options: {
            filter: "category == $category",
            filterParams: {
              category: "sponsor",
            },
          },
        },
      ],
    },
    {
      type: "array",
      name: "mediaPartner",
      title: "Medienpartner",
      of: [
        {
          type: "reference",
          to: [{ type: "partner" }],
          options: {
            filter: "category == $category",
            filterParams: {
              category: "media-partner",
            },
          },
        },
      ],
    },
    {
      type: "array",
      name: "additionalPartner",
      title: "Andere Partner (Außerdem)",
      of: [
        {
          type: "reference",
          to: [{ type: "partner" }],
          options: {
            filter: "category == $category",
            filterParams: {
              category: "additional",
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Sortierungen",
      };
    },
  },
};
