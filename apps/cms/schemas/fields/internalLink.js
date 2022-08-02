import { HiOutlineLink } from "react-icons/hi";

export default (...references) => ({
  type: "object",
  title: "Internal Link",
  name: "internalLink",
  icon: HiOutlineLink,
  fields: [
    {
      name: "reference",
      type: "reference",
      title: "Reference",
      to: references.map((reference) => ({ type: reference })),
    },
    {
      type: "url",
      name: "url",
      title: "Relative URL",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          relativeOnly: true,
        }),
    },
  ],
});
