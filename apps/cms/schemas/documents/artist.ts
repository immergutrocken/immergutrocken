import {
  FaCompactDisc,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaSpotify,
  FaVimeo,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { RiMusic2Line } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import { defineArrayMember, defineField, defineType } from "sanity";

import blockContent from "../fields/blockContent";
import externalLink from "../fields/externalLink";
import image from "../fields/image";
import slug from "../fields/slug";
import localizedTabs from "./localizedTabs";

const fields = [
  defineField({
    type: "string",
    name: "title",
    title: "Titel",
    validation: (rule) => rule.required(),
  }),
  defineField({
    type: "string",
    name: "subtitle",
    title: "Untertitel",
  }),
  defineField({
    ...image,
    title: "Banner",
    name: "banner",
    validation: (rule) => rule.required(),
  }),
  defineField({
    ...blockContent,
    of: [...blockContent.of],
    validation: (rule) => rule.required(),
  }),
];

const performanceGroup = defineField({
  title: "Auftritt",
  name: "performance",
  type: "object",
  fields: [
    defineField({
      title: "Bühne",
      name: "stage",
      type: "string",
      options: {
        list: ["Waldbühne", "Zeltbühne", "Birkenhain", "Wortbühne"],
      },
    }),
    defineField({
      title: "Zeit",
      name: "time",
      type: "datetime",
    }),
  ],
});

export default defineType({
  type: "document",
  name: "artist",
  title: "Künstler*in",
  icon: RiMusic2Line,
  fields: [
    localizedTabs(fields),
    slug,
    defineField({
      title: "Autor",
      name: "author",
      type: "string",
    }),
    defineField({
      type: "string",
      name: "category",
      title: "Kategorie",
      options: {
        list: [
          { title: "Musik", value: "music" },
          { title: "Lesung", value: "reading" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "array",
      name: "socialMedia",
      title: "Social Media",
      of: [
        defineArrayMember({
          type: "object",
          name: "link",
          title: "Social Media Link",
          fields: [
            defineField({
              type: "string",
              name: "medium",
              title: "Soziales Medium",
              options: {
                list: [
                  { title: "Website", value: "Website" },
                  { title: "YouTube", value: "YouTube" },
                  { title: "Facebook", value: "Facebook" },
                  { title: "Twitter", value: "Twitter" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "Vimeo", value: "Vimeo" },
                  { title: "TikTok", value: "TikTok" },
                  { title: "Spotify", value: "Spotify" },
                  { title: "Label", value: "Label" },
                ],
              },
            }),
            externalLink,
          ],
          preview: {
            select: {
              title: "medium",
            },
            prepare(selection) {
              const { title } = selection;
              let media;
              switch (title) {
                case "Website":
                  media = FaGlobe;
                  break;
                case "YouTube":
                  media = FaYoutube;
                  break;
                case "Facebook":
                  media = FaFacebook;
                  break;
                case "Twitter":
                  media = FaXTwitter;
                  break;
                case "Instagram":
                  media = FaInstagram;
                  break;
                case "Vimeo":
                  media = FaVimeo;
                  break;
                case "TikTok":
                  media = SiTiktok;
                  break;
                case "Spotify":
                  media = FaSpotify;
                  break;
                case "Label":
                  media = FaCompactDisc;
                  break;
                default:
                  break;
              }
              return {
                title: title,
                media: media,
              };
            },
          },
        }),
      ],
    }),
    performanceGroup,
  ],
  preview: {
    select: {
      title: "languages.de.title",
      subtitle: "languages.de.subtitle",
      media: "languages.de.banner",
    },
  },
});
