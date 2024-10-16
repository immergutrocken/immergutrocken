import { BsChevronExpand } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';

import blockContent from './blockContent';

export default defineType({
  type: "object",
  name: "expander",
  title: "Expander",
  icon: BsChevronExpand,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Titel",
    }),
    blockContent,
  ],
});
