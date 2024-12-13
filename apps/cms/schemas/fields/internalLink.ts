import { HiOutlineLink } from "react-icons/hi";
import { defineField } from "sanity";

export default (...references: string[]) =>
  defineField({
    type: "object",
    title: "Internal Link",
    name: "internalLink",
    icon: HiOutlineLink,
    fields: [
      defineField({
        name: "reference",
        type: "reference",
        title: "Reference",
        to: references.map((reference) => ({ type: reference })),
      }),
      defineField({
        type: "url",
        name: "url",
        title: "Relative URL",
        validation: (rule) =>
          rule.uri({
            allowRelative: true,
            relativeOnly: true,
          }),
      }),
    ],
  });
