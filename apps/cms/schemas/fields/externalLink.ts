import { HiOutlineExternalLink } from "react-icons/hi";
import { defineField } from "sanity";

export default defineField({
  title: "External Link",
  name: "link",
  type: "object",
  icon: HiOutlineExternalLink,
  fields: [
    defineField({
      title: "URL",
      name: "url",
      type: "url",
      validation: (rule) =>
        rule.required().uri({
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
  ],
});
