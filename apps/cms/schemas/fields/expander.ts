import { BsChevronExpand } from 'react-icons/bs';
import { defineField } from 'sanity';

import blockContent from './blockContent';

export default defineField({
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
