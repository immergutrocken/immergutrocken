import { FaColumns } from "react-icons/fa";
import blockContent from "./blockContent";
import { BiColumns } from "react-icons/bi";

export const twoColumns = {
  type: "object",
  name: "twoColumns",
  title: "2 Spalten",
  icon: FaColumns,
  fields: [
    { ...blockContent, name: "firstColumn", title: "1. Spalte" },
    { ...blockContent, name: "secondColumn", title: "2. Spalte" },
  ],
  preview: {
    prepare() {
      return { title: "2 Spalten" };
    },
  },
};

export const threeColumns = {
  type: "object",
  name: "threeColumns",
  title: "3 Spalten",
  icon: BiColumns,
  fields: [
    { ...blockContent, name: "firstColumn", title: "1. Spalte" },
    { ...blockContent, name: "secondColumn", title: "2. Spalte" },
    { ...blockContent, name: "thirdColumn", title: "3. Spalte" },
  ],
  preview: {
    prepare() {
      return { title: "3 Spalten" };
    },
  },
};
