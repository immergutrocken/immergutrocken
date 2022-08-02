import { HiOutlineExternalLink } from "react-icons/hi";

export default {
  title: "External Link",
  name: "link",
  type: "object",
  icon: HiOutlineExternalLink,
  fields: [
    {
      title: "URL",
      name: "url",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https", "mailto", "tel"],
        }),
    },
  ],
};
