import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

import { track } from "@vercel/analytics/react";

import { NotificationDisplayCategory } from "../lib/enums/notificationDisplayCategory";
import { IGeneralSettings } from "../lib/general-settings";
import { IMenuItem } from "../lib/menu";
import { INewsLink } from "../lib/news";
import { INotification } from "../lib/notification";
import { IPartner } from "../lib/partner";
import Footer from "./footer";
import Menu from "./menu";
import Notification from "./notification";
import Bubble from "./shared/bubble";
import Button from "./shared/button";
import Link from "./shared/link";

interface LayoutProps {
  children: ReactNode;
  notifcationList: INotification[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  newsList: INewsLink[];
  ticketshopUrl: string;
  showNewsList?: boolean;
  generalSettings: IGeneralSettings;
}

const Layout = ({
  children,
  notifcationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
  ticketshopUrl,
  showNewsList = true,
  generalSettings,
}: LayoutProps): ReactNode => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const t = useTranslations("Layout");

  return (
    <div className="bg-secondary text-primary">
      <header className="fixed top-0 z-10 flex w-full flex-col">
        {showNewsList && (
          <div className="flex w-full flex-nowrap border-b-2 border-primary bg-secondary py-1 font-important text-lg sm:text-4xl">
            <span className="flex items-center px-1 sm:px-2">{t("news")}:</span>
            <div
              className={
                "scrollbar flex w-full flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap"
              }
            >
              {newsList.map((news, index) => (
                <span key={news.slug}>
                  <NextLink
                    href={`/article/${news.slug}`}
                    className="mx-2 sm:mx-4"
                  >
                    {news.title}
                  </NextLink>
                  {index === newsList.length - 1 ? "" : "•"}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mx-2 mt-2 flex justify-between sm:mx-4 sm:mt-4">
          <Bubble
            className="left-2 top-12 sm:left-4 sm:top-16"
            onClick={() => setShowMenu(true)}
          >
            <em className="fas fa-bars text-secondary"></em>
          </Bubble>
          <div className="right-2 top-12 flex gap-2 sm:right-4 sm:top-16 sm:gap-4">
            {ticketshopUrl && (
              <Link href={ticketshopUrl} className="hover:no-underline">
                <Button
                  className="!bg-[#FA5925]"
                  click={() => track("Kartenladen (Header)")}
                >
                  {t("ticket-shop")}
                </Button>
              </Link>
            )}
            <NextLink
              href={router.asPath}
              locale={router.locale === "de" ? "en" : "de"}
              className="hover:no-underline"
            >
              <Bubble className="font-important text-xl sm:text-3xl">
                {router.locale === "de" ? "en" : "de"}
              </Bubble>
            </NextLink>
          </div>
        </div>
        <Menu
          showMenu={showMenu}
          onClose={() => setShowMenu(false)}
          items={menuItems}
        />
      </header>
      <main className={showNewsList ? "mt-[38px] sm:mt-[50px]" : ""}>
        {children}
      </main>
      <footer>
        <Footer
          sponsorList={sponsorList}
          mediaPartnerList={mediaPartnerList}
          additionalList={additionalList}
          generalSettings={generalSettings}
        />
        <div className="fixed bottom-0 z-20 w-full">
          {notifcationList
            ?.filter(
              (notification) =>
                notification.display === NotificationDisplayCategory.FOOTER,
            )
            .map((notification) => (
              <Notification
                notification={notification}
                key={notification.title}
              />
            ))}
        </div>
        {notifcationList
          ?.filter(
            (notification) =>
              notification.display === NotificationDisplayCategory.POP_UP,
          )
          .map((notification) => (
            <Notification
              notification={notification}
              key={notification.title}
            ></Notification>
          ))}
      </footer>
    </div>
  );
};

export default Layout;
