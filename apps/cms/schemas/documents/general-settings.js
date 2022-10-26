import { getImage } from "../fields/image";
import localizedTabs from "./localizedTabs";

const fields = [
  {
    title: "Titel der Website",
    name: "websiteTitle",
    type: "string",
  },
  {
    ...getImage(false),
    title: "Banner Desktop",
    name: "bannerDesktop",
    description: "3280px breit und 1336px hoch sein für optimale Darstellung",
  },
  {
    ...getImage(false),
    title: "Banner Mobile",
    name: "bannerMobile",
    description: "1800px breit und 2250px hoch sein für optimale Darstellung",
  },
];

export default {
  title: "Allgemein",
  type: "document",
  name: "generalSettings",
  fields: [localizedTabs(fields)],
  preview: {
    prepare() {
      return {
        title: "Allgemeine Einstellungen",
      };
    },
  },
};
