import { HiOutlineExternalLink } from 'react-icons/hi';
import { defineField, defineType } from 'sanity';

export default defineType({
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
