import groq from "groq";
import { MenuItemType } from "./enums/menuItemType.enum";
import client from "./shared/sanityClient";

interface ISanityMenu {
  _id: string;
  displayName: {
    de: string;
    en: string;
  };
  isMainMenu: boolean;
  menuEntries: {
    title: {
      de: string;
      en: string;
    };
    reference?: {
      _ref: string;
    };
    _type: string;
    _ref?: string;
    url?: string;
  }[];
  menuEntryRefs: {
    _id: string;
    _type: string;
    slug: {
      current: string;
    };
  }[];
}

export interface IMenuItem {
  type: MenuItemType;
  title: {
    de: string;
    en: string;
  };
  url?: string;
  slug?: string;
  documentType?: string;
  submenuItems?: IMenuItem[];
}

const typeMapping = new Map<string, MenuItemType>([
  ["internalLink", MenuItemType.INTERNAL_LINK],
  ["link", MenuItemType.EXTERNAL_LINK],
  ["submenu", MenuItemType.SUBMENU],
]);

const buildMenuItems = (
  menu: ISanityMenu,
  data: ISanityMenu[]
): IMenuItem[] => {
  return menu.menuEntries.map((entry): IMenuItem => {
    const type = typeMapping.get(entry._type);
    const submenu = data.find((menu) => menu._id === entry._ref);
    const ref = menu.menuEntryRefs.find(
      (ref) => ref?._id === entry.reference?._ref
    );
    switch (type) {
      case MenuItemType.EXTERNAL_LINK:
        return {
          title: entry.title,
          type: type,
          url: entry.url,
        };
      case MenuItemType.INTERNAL_LINK:
        return {
          type: type,
          title: entry.title,
          slug: ref ? ref.slug.current : null,
          documentType: ref ? ref._type : null,
          url: entry.url ?? null,
        };
      case MenuItemType.SUBMENU:
        return {
          title: submenu.displayName,
          type: type,
          submenuItems: buildMenuItems(submenu, data),
        };
      default:
        throw new Error(`The type ${type} is not implemented`);
    }
  });
};

export const getMenu = async (): Promise<IMenuItem[]> => {
  const query = groq`
  *
  [_type == 'menu']
  {
    isMainMenu,
    menuEntries,
    displayName,
    _id,
    'menuEntryRefs': menuEntries[].reference->{_id, _type, slug}
  }`;
  const data = await client.fetch(query);
  const mainMenu = data.find((menu: ISanityMenu) => menu.isMainMenu === true);
  const menuItems = buildMenuItems(mainMenu, data);
  return menuItems;
};
