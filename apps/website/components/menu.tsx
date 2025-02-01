import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import { ReactNode, useState } from "react";

import { track } from "@vercel/analytics/react";

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
  locale: string | undefined,
): ReactNode => {
  switch (item.type) {
    case MenuItemType.EXTERNAL_LINK:
      if (item.url == null) throw new Error("External link must have a url");
      return (
        <Link
          href={item.url}
          click={() => {
            if (
              item.title.de === "Kartenladen" ||
              item.title.en === "ticket shop"
            )
              track("Kartenladen (Menü)");
            onClose();
          }}
        >
          {locale === "de" ? item.title.de : item.title.en}
        </Link>
      );
    case MenuItemType.INTERNAL_LINK:
      return (
        <NextLink
          href={
            item.url != null ? item.url : `/${item.documentType}/${item.slug}`
          }
          onClick={() => onClose()}
        >
          {locale === "de" ? item.title.de : item.title.en}
        </NextLink>
      );
    case MenuItemType.SUBMENU:
      return (
        <>
          <div>{locale === "de" ? item.title.de : item.title.en}</div>
          {item.submenuItems?.map((subMenuItem, index) => (
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
}: MenuProps): ReactNode => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  return (
    <AnimatePresence onExitComplete={() => setShowContent(false)}>
      {showMenu && (
        <div className={`fixed bottom-0 left-0 top-0 z-20 w-full sm:w-[512px]`}>
          <motion.div
            onAnimationComplete={() => {
              setShowContent(true);
            }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            exit={{ width: 0 }}
            className={`h-full overflow-y-auto border-primary bg-secondary font-important sm:border-r-2`}
          >
            <AnimatePresence onExitComplete={() => onClose()}>
              {showContent && (
                <motion.div
                  className={`w-full px-2 sm:w-auto sm:px-12`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Bubble
                    className="absolute right-3 top-3"
                    onClick={() => setShowContent(false)}
                  >
                    <em className="fas fa-times text-secondary"></em>
                  </Bubble>
                  <div className="mt-12 flex justify-center gap-4 sm:mt-20">
                    <NextLink href="/" onClick={() => setShowContent(false)}>
                      <Bubble className="!bg-tertiary">
                        <EuterIcon className="h-6 fill-secondary sm:h-9"></EuterIcon>
                      </Bubble>
                    </NextLink>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    {items.map((item, index) => (
                      <div
                        className="text-center text-3xl sm:text-6xl"
                        key={index}
                      >
                        {buildMenuItem(
                          item,
                          () => setShowContent(false),
                          router.locale,
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center gap-4">
                    <NextLink
                      href={router.asPath}
                      locale={router.locale === "de" ? "en" : "de"}
                      className="mb-6 hover:no-underline"
                    >
                      <Bubble className="font-important text-xl sm:text-3xl">
                        {router.locale === "de" ? "en" : "de"}
                      </Bubble>
                    </NextLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
