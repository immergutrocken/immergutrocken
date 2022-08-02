import { FaImage } from "react-icons/fa";

export const getImage = (isMetaDataRequired = true) => ({
  name: "image",
  type: "image",
  title: "Bild",
  icon: FaImage,
  options: {
    hotspot: true,
  },
  fields: [
    {
      title: "Caption",
      name: "caption",
      type: "string",
      description: "Bildunterschrift",
    },
    {
      title: "Alternativer Text",
      name: "alt",
      type: "string",
      description:
        "Text der angezeigt wird, wenn das Bild nicht geladen werden kann.",
      validation: isMetaDataRequired ? (Rule) => Rule.required() : undefined,
    },
    {
      title: "Credits",
      name: "credits",
      type: "string",
      validation: isMetaDataRequired ? (Rule) => Rule.required() : undefined,
    },
  ],
});

export default getImage();
