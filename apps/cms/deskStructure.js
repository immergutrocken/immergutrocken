import S from "@sanity/desk-tool/structure-builder";
import { MdFormatListNumbered } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { createSuperPane } from "sanity-super-pane";
import { RiArticleLine } from "react-icons/ri";
import { RiMusic2Line } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Artikel")
        .icon(RiArticleLine)
        .child(createSuperPane("article", S)),
      S.listItem()
        .title("Künstler*innen")
        .icon(RiMusic2Line)
        .child(createSuperPane("artist", S)),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "sortings",
            "verein",
            "article",
            "artist",
            "generalSettings",
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
    ]);
