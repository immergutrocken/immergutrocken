import { getImage } from "../fields/image";
import localizedTabs from "./localizedTabs";

const fields = [
  {
    title: "Titel der Website",
    name: "websiteTitle",
    type: "string",
    description: "wird im Browser Tab angezeigt",
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
  {
    name: "additionalTextAfterArtists",
    type: "string",
    title: "Text nach Künstler Liste",
    description: 'zum Beispiel "und viele mehr"',
  },
];

export default {
  title: "Allgemein",
  type: "document",
  name: "generalSettings",
  fields: [
    localizedTabs(fields),
    {
      name: "displayMode",
      type: "string",
      title: "Anzeigemodus",
      description:
        "zeigt die gewählte Option als Hauptinhalt auf der Startseite an",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Künstler", value: "artists" },
        ],
        layout: "radio",
      },
    },
    {
      title: "Auftrittsdetails anzeigen?",
      description: 'zeigt, wenn aktiviert, die Auftrittsdetails der Künstler (Stage und Uhrzeit) und den Time-Table auf der Webseite an',
      name: "isPerformanceDetailsVisible",
      type: "boolean",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Allgemeine Einstellungen",
      };
    },
  },
};
