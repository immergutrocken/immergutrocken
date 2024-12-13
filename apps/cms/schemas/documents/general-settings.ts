import {
  CustomValidatorResult,
  defineField,
  defineType,
  ValidationContext,
} from "sanity";

import { getImage } from "../fields/image";
import localizedTabs from "./localizedTabs";

const fields = [
  defineField({
    title: "Titel der Website",
    name: "websiteTitle",
    type: "string",
    description: "wird im Browser Tab angezeigt",
  }),
  defineField({
    ...getImage(false),
    title: "Banner Desktop",
    name: "bannerDesktop",
    description: "3280px breit und 1336px hoch sein für optimale Darstellung",
  }),
  defineField({
    ...getImage(false),
    title: "Banner Mobile",
    name: "bannerMobile",
    description: "1800px breit und 2250px hoch sein für optimale Darstellung",
  }),
  defineField({
    name: "additionalTextAfterArtists",
    type: "string",
    title: "Text nach Künstler Liste",
    description: 'zum Beispiel "und viele mehr"',
  }),
];

export default defineType({
  title: "Allgemein",
  type: "document",
  name: "generalSettings",
  fields: [
    localizedTabs(fields),
    defineField({
      title: "Kartenladen Link",
      description:
        "Link zum Kartenladen vom Kartenladen-Button. Wenn leer, wird der Button nicht angezeigt.",
      name: "ticketshopUrl",
      type: "url",
      validation: (rule) =>
        rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "displayMode",
      type: "string",
      title: "Anzeigemodus",
      description:
        "zeigt die gewählte Option als Hauptinhalt auf der Startseite an",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Künstler", value: "artists" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      title: "Auftrittsdetails anzeigen?",
      description:
        "Wenn aktiviert, wird Bühne und Zeit beim Künstler sowie der Time-Table auf der Website angezeigt",
      name: "isPerformanceDetailsVisible",
      type: "boolean",
    }),
    defineField({
      title: "Countdown",
      name: "countdown",
      type: "object",
      fields: [
        defineField({
          title: "Soll der Countdown angezeigt werden?",
          name: "showCountdown",
          type: "boolean",
          description: "Zeigt den Countdown im Footer an",
          validation: (rule) => rule.required(),
        }),
        defineField({
          title: "Startdatum des Festivals",
          name: "festivalStartDate",
          type: "date",
          validation: (rule) => rule.custom(validateCountdownDate),
        }),
        defineField({
          title: "Enddatum des Festivals",
          name: "festivalEndDate",
          type: "date",
          validation: (rule) => rule.custom(validateCountdownDate),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Allgemeine Einstellungen",
      };
    },
  },
});

const validateCountdownDate = (
  date: string | undefined,
  context: ValidationContext,
): CustomValidatorResult | Promise<CustomValidatorResult> => {
  if ((context.document as any)?.countdown?.showCountdown && !date) {
    return "Datum muss angegeben werden, wenn Countdown aktiviert ist";
  }

  return true;
};
