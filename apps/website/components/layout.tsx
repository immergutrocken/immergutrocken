import Notification from "./notification";
import { INotification } from "../lib/notification";
import { NotificationDisplayCategory } from "../lib/enums/notificationDisplayCategory";
import Footer from "./footer";
import { IPartner } from "../lib/partner";
import React, { useState } from "react";
import Menu from "./menu";
import Bubble from "./shared/bubble";
import { IMenuItem } from "../lib/menu";
import Button from "./shared/button";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import Link from "./shared/link";
import { INewsLink } from "../lib/news";

interface LayoutProps {
  children: JSX.Element | JSX.Element[] | string;
  notifcationList: INotification[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  newsList: INewsLink[];
  showNewsList?: boolean;
}

const Layout = ({
  children,
  notifcationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
  showNewsList = true,
}: LayoutProps): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const t = useTranslations("Layout");

  return (
    <div className="text-primary bg-secondary">
      <header className="fixed top-0 z-10 flex flex-col w-full">
        {showNewsList && (
          <div className="flex w-full py-1 text-lg border-b-2 bg-secondary border-primary flex-nowrap sm:text-4xl font-important">
            <span className="flex items-center px-1 sm:px-2">{t("news")}:</span>
            <div
              className={
                "flex flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap w-full scrollbar"
              }
            >
              {newsList.map((news, index) => (
                <span key={index}>
                  <NextLink href={`/article/${news.slug}`}>
                    <a className="mx-2 sm:mx-4">{news.title}</a>
                  </NextLink>
                  {index === newsList.length - 1 ? "" : "•"}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between mx-2 mt-2 sm:mt-4 sm:mx-4">
          <Bubble
            className="left-2 top-12 sm:left-4 sm:top-16"
            onClick={() => setShowMenu(true)}
          >
            <em className="fas fa-bars text-secondary"></em>
          </Bubble>
          <div className="flex gap-2 right-2 top-12 sm:right-4 sm:top-16 sm:gap-4">
            <Link
              href="https://immergut.tickettoaster.de/tickets"
              className="hover:no-underline"
            >
              <Button className="!bg-tertiary">{t("ticket-shop")}</Button>
            </Link>
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
        <Menu
          showMenu={showMenu}
          onClose={() => setShowMenu(false)}
          items={menuItems}
        />
      </header>
      <main>{children}</main>
      <footer>
        <Footer
          sponsorList={sponsorList}
          mediaPartnerList={mediaPartnerList}
          additionalList={additionalList}
        />
        <div className="fixed bottom-0 z-20 w-full">
          {notifcationList
            ?.filter(
              (notification) =>
                notification.display === NotificationDisplayCategory.FOOTER
            )
            .map((notification, index) => (
              <Notification notification={notification} key={index} />
            ))}
        </div>
        {notifcationList
          ?.filter(
            (notification) =>
              notification.display === NotificationDisplayCategory.POP_UP
          )
          .map((notification, index) => (
            <Notification
              notification={notification}
              key={index}
            ></Notification>
          ))}
      </footer>
    </div>
  );
};

export default Layout;
