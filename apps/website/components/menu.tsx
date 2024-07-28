import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import { useState } from 'react';

import { track } from '@vercel/analytics/react';

import { MenuItemType } from '../lib/enums/menuItemType.enum';
import { IMenuItem } from '../lib/menu';
import Bubble from './shared/bubble';
import EuterIcon from './shared/euter-icon';
import Link from './shared/link';

interface MenuProps {
  onClose: () => void;
  showMenu: boolean;
  items: IMenuItem[];
}

const buildMenuItem = (
  item: IMenuItem,
  onClose: () => void,
  locale: string | undefined
): JSX.Element => {
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
}: MenuProps): JSX.Element => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  return (
    <AnimatePresence onExitComplete={() => setShowContent(false)}>
      {showMenu && (
        <div className={`w-full sm:w-[512px] fixed z-20 left-0 top-0 bottom-0`}>
          <motion.div
            onAnimationComplete={() => {
              setShowContent(true);
            }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
            exit={{ width: 0 }}
            className={`overflow-y-auto bg-secondary sm:border-r-2 border-primary h-full font-important`}
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
                    className="absolute top-3 right-3"
                    onClick={() => setShowContent(false)}
                  >
                    <em className="fas fa-times text-secondary"></em>
                  </Bubble>
                  <div className="flex justify-center gap-4 mt-12 sm:mt-20">
                    <NextLink href="/" onClick={() => setShowContent(false)}>
                      <Bubble className="!bg-tertiary">
                        <EuterIcon className="h-6 sm:h-9 fill-secondary"></EuterIcon>
                      </Bubble>
                    </NextLink>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    {items.map((item, index) => (
                      <div
                        className="text-3xl text-center sm:text-6xl"
                        key={index}
                      >
                        {buildMenuItem(
                          item,
                          () => setShowContent(false),
                          router.locale
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <NextLink
                      href={router.asPath}
                      locale={router.locale === "de" ? "en" : "de"}
                      className="mb-6 hover:no-underline"
                    >
                      <Bubble className="text-xl sm:text-3xl font-important">
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
