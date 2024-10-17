import { BiColumns } from 'react-icons/bi';
import { FaColumns } from 'react-icons/fa';
import { defineField, defineType } from 'sanity';

import blockContent from './blockContent';

export const twoColumns = defineType({
  type: "object",
  name: "twoColumns",
  title: "2 Spalten",
  icon: FaColumns,
  fields: [
    defineField({ ...blockContent, name: "firstColumn", title: "1. Spalte" }),
    defineField({ ...blockContent, name: "secondColumn", title: "2. Spalte" }),
  ],
  preview: {
    prepare() {
      return { title: "2 Spalten" };
    },
  },
});

export const threeColumns = defineType({
  type: "object",
  name: "threeColumns",
  title: "3 Spalten",
  icon: BiColumns,
  fields: [
    defineField({ ...blockContent, name: "firstColumn", title: "1. Spalte" }),
    defineField({ ...blockContent, name: "secondColumn", title: "2. Spalte" }),
    defineField({ ...blockContent, name: "thirdColumn", title: "3. Spalte" }),
  ],
  preview: {
    prepare() {
      return { title: "3 Spalten" };
    },
  },
});
