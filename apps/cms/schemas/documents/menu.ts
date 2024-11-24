import { RiMenuAddLine } from 'react-icons/ri';
import { defineArrayMember, defineField, defineType } from 'sanity';

import externalLink from '../fields/externalLink';
import { withTitle } from '../fields/fieldExtender';
import internalLink from '../fields/internalLink';
import localeString from '../fields/localeString';

export default defineType({
  title: "Menü",
  type: "document",
  name: "menu",
  icon: RiMenuAddLine,
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Name",
    }),
    localeString("Titel", "displayName"),
    defineField({
      type: "boolean",
      name: "isMainMenu",
      title: "Ist dieses Menü ein Hauptmenü?",
    }),
    defineField({
      type: "array",
      name: "menuEntries",
      title: "Menü Einträge",
      of: [
        withTitle(externalLink),
        withTitle(internalLink("article", "artist")),
        defineArrayMember({
          type: "reference",
          name: "submenu",
          title: "Untermenü",
          to: [{ type: "menu" }],
          options: {
            filter: "isMainMenu == $isMainMenu",
            filterParams: { isMainMenu: false },
          },
        }),
      ],
    }),
  ],
  initialValue: {
    isMainMenu: false,
  },
});
