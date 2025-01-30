import { RiNotification2Line } from "react-icons/ri";
import { defineField, defineType } from "sanity";

import blockContent from "../fields/blockContent";
import localizedTabs from "./localizedTabs";

const fields = [
  defineField({
    type: "string",
    name: "title",
    title: "Titel",
  }),
  defineField({ ...blockContent, validation: (rule) => rule.required() }),
];

export default defineType({
  type: "document",
  name: "notification",
  title: "Benachrichtigungen",
  icon: RiNotification2Line,
  fields: [
    localizedTabs(fields),
    defineField({
      type: "date",
      name: "startDate",
      title: "Startdatum",
    }),
    defineField({
      type: "date",
      name: "endDate",
      title: "Enddatum",
    }),
    defineField({
      type: "string",
      name: "displayCategory",
      title: "Darstellungsart",
      options: {
        layout: "dropdown",
        list: [
          { title: "Footer", value: "footer" },
          { title: "Pop-up", value: "pop-up" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "languages.de.title",
    },
  },
});
