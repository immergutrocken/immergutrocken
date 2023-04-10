import { RiNotification2Line } from "react-icons/ri";
import supportedLanguages from "../../supportedLanguages";
import blockContent from "../fields/blockContent";

const fields = [
  {
    type: "string",
    name: "title",
    title: "Titel",
  },
  { ...blockContent, validation: (Rule) => Rule.required() },
];

const buildFields = () => {
  const languagedFields = [];
  supportedLanguages.forEach((lang) => {
    const langObject = {
      type: "object",
      name: lang.id,
      title: lang.title,
      fieldset: lang.id + "-tab",
      fields: fields,
    };
    languagedFields.push(langObject);
  });
  return languagedFields;
};

export default {
  type: "document",
  name: "notification",
  title: "Benachrichtigungen",
  icon: RiNotification2Line,
  fields: [
    {
      name: "languages",
      type: "object",
      fieldsets: supportedLanguages.map((lang) => ({
        name: lang.id + "-tab",
        title: lang.title,
      })),
      fields: buildFields(),
    },
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
