import { FaShoppingBag, FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdFormatListNumbered } from "react-icons/md";
import { RiArticleLine, RiMusic2Line } from "react-icons/ri";

export default (S) =>
  S.list()
    .title("Content")
    .items([
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "sortings",
            "verein",
            "generalSettings",
            "merch",
            "media.tag",
          ].includes(listItem.getId())
      ),
      S.divider(),
      S.listItem()
        .title("Allgemein")
        .icon(IoMdSettings)
        .child(
          S.editor().schemaType("generalSettings").documentId("generalSettings")
        ),
      S.listItem()
        .title("Sortierungen")
        .icon(MdFormatListNumbered)
        .child(S.editor().schemaType("sortings").documentId("sortings")),
      S.listItem()
        .title("Verein")
        .icon(FaUsers)
        .child(S.editor().schemaType("verein").documentId("verein")),
      S.listItem()
        .title("Merch")
        .icon(FaShoppingBag)
        .child(S.editor().schemaType("merch").documentId("merch")),
    ]);
