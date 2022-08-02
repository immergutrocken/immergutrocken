import { BsChevronExpand } from "react-icons/bs";
import blockContent from "./blockContent";

export default {
  type: "object",
  name: "expander",
  title: "Expander",
  icon: BsChevronExpand,
  fields: [
    {
      type: "string",
      name: "title",
      title: "Titel",
    },
    blockContent,
  ],
};
