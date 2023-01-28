import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import { MenuItemType } from "../lib/enums/menuItemType.enum";
import { IMenuItem } from "../lib/menu";
import Bubble from "./shared/bubble";
import EuterIcon from "./shared/euter-icon";
import Link from "./shared/link";

interface MenuProps {
  onClose: () => void;
  showMenu: boolean;
  items: IMenuItem[];
}

const buildMenuItem = (
  item: IMenuItem,
  onClose: () => void,
  locale: string
): JSX.Element => {
  switch (item.type) {
    case MenuItemType.EXTERNAL_LINK:
      return (
        <Link href={item.url} click={() => onClose()}>
          {locale === "de" ? item.title.de : item.title.en}
        </Link>
      );
    case MenuItemType.INTERNAL_LINK:
      return (
        <NextLink
          href={
            item.url != null ? item.url : `/${item.documentType}/${item.slug}`
          }
        >
          {/* eslint-disable-next-line */}
          <a onClick={() => onClose()}>
            {locale === "de" ? item.title.de : item.title.en}
          </a>
        </NextLink>
      );
    case MenuItemType.SUBMENU:
      return (
        <>
          <div>{locale === "de" ? item.title.de : item.title.en}</div>
          {item.submenuItems.map((subMenuItem, index) => (
            <div className="text-lg sm:text-3xl" key={index}>
              {buildMenuItem(subMenuItem, onClose, locale)}
            </div>
          ))}
        </>
      );
    default:
      throw new Error(`No menu item implemented for type ${item.type}`);
  }
};

const Menu = ({
  onClose,
  showMenu = false,
  items = [],
}: MenuProps): JSX.Element => {
  const displayClass = showMenu ? "block" : "hidden";
  const router = useRouter();

  return (
    <div
      className={`w-full px-2 overflow-y-auto sm:w-auto sm:px-12 bg-secondary sm:border-r-2 border-primary fixed z-20 left-0 h-full pb-6 font-important ${displayClass}`}
    >
      <Bubble className="absolute top-3 right-3" onClick={() => onClose()}>
        <em className="fas fa-times text-secondary"></em>
      </Bubble>
      <div className="flex justify-center mt-12 sm:mt-20  gap-4">
        <NextLink href="/">
          <a>
            <Bubble className="!bg-[#ffef09]">
              <EuterIcon className="h-8"></EuterIcon>
            </Bubble>
          </a>
        </NextLink>
      </div>
      <div className="mt-4 sm:mt-6">
        {items.map((item, index) => (
          <div className="text-3xl text-center sm:text-6xl" key={index}>
            {buildMenuItem(item, onClose, router.locale)}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4  gap-4">
        <NextLink
          href={router.asPath}
          locale={router.locale === "de" ? "en" : "de"}
        >
          <a>
            <Bubble className="text-xl sm:text-3xl font-important">
              {router.locale === "de" ? "en" : "de"}
            </Bubble>
          </a>
        </NextLink>
      </div>
    </div>
  );
};

export default Menu;
