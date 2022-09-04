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
  },
  {
    ...getImage(false),
    title: "Banner Mobile",
    name: "bannerMobile",
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
