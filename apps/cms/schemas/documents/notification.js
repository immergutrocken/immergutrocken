import { RiNotification2Line } from "react-icons/ri";
import supportedLanguages from "../../supportedLanguages";
import blockContent from "../fields/blockContent";
import localizedTabs from "./localizedTabs";

const fields = [
  {
    type: "string",
    name: "title",
    title: "Titel",
  },
  { ...blockContent, validation: (Rule) => Rule.required() },
];
export default {
  type: "document",
  name: "notification",
  title: "Benachrichtigungen",
  icon: RiNotification2Line,
  fields: [
    localizedTabs(fields),
    {
      type: "date",
      name: "startDate",
      title: "Startdatum",
    },
    {
      type: "date",
      name: "endDate",
      title: "Enddatum",
    },
    {
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
    },
  ],
  preview: {
    select: {
      title: "languages.de.title",
    },
  },
};
