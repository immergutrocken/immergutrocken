import {
  FaCompactDisc,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaSpotify,
  FaTwitter,
  FaVimeo,
  FaYoutube,
} from "react-icons/fa";
import { RiMusic2Line } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import blockContent from "../fields/blockContent";
import externalLink from "../fields/externalLink";
import image from "../fields/image";
import { slug } from "../fields/slug";
import localizedTabs from "./localizedTabs";

const fields = [
  {
    type: "string",
    name: "title",
    title: "Titel",
    validation: (Rule) => Rule.required(),
  },
  {
    type: "string",
    name: "subtitle",
    title: "Untertitel",
  },
  {
    ...image,
    title: "Banner",
    name: "banner",
    validation: (Rule) => Rule.required(),
  },
  {
    ...blockContent,
    of: [...blockContent.of],
    validation: (Rule) => Rule.required(),
  },
];

const performanceGroup = {
  title: "Auftritt",
  name: "performance",
  type: 'object',
  fields: [
    {
      title: "Bühne",
      name: "stage",
      type: "string",
      options: {
        list: [
          "Waldbühne",
          "Zeltbühne",
          "Birkenhain",
          "Wortbühne"
        ],
      }
    },
    {
      title: 'Zeit',
      name: 'time',
      type: 'datetime'
    },
  ]
}

export default {
  type: "document",
  name: "artist",
  title: "Künstler*in",
  icon: RiMusic2Line,
  fields: [
    localizedTabs(fields),
    slug,
    {
      title: "Autor",
      name: "author",
      type: "string",
    },
    {
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
      validation: (Rule) => Rule.required(),
    },
    {
      type: "array",
      name: "socialMedia",
      title: "Social Media",
      of: [
        {
          type: "object",
          name: "link",
          title: "Social Media Link",
          fields: [
            {
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
            },
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
                case "Youtube":
                  media = FaYoutube;
                  break;
                case "Facebook":
                  media = FaFacebook;
                  break;
                case "Twitter":
                  media = FaTwitter;
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
        },
      ],
    },
    performanceGroup,
  ],
  preview: {
    select: {
      title: "languages.de.title",
      subtitle: "languages.de.subtitle",
      media: "languages.de.banner",
    },
  },
};
