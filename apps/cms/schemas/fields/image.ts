import { FaImage } from 'react-icons/fa';
import { defineField } from 'sanity';

export const getImage = (isMetaDataRequired = true) =>
  defineField({
    name: "image",
    type: "image",
    title: "Bild",
    icon: FaImage,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        title: "Caption",
        name: "caption",
        type: "string",
        description: "Bildunterschrift",
      }),
      defineField({
        title: "Alternativer Text",
        name: "alt",
        type: "string",
        description:
          "Text der angezeigt wird, wenn das Bild nicht geladen werden kann.",
        validation: isMetaDataRequired ? (rule) => rule.required() : undefined,
      }),
      defineField({
        title: "Credits",
        name: "credits",
        type: "string",
        validation: isMetaDataRequired ? (rule) => rule.required() : undefined,
      }),
    ],
  });

export default getImage();
