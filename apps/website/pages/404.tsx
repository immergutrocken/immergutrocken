import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useTranslations } from "next-intl";
import NextHead from "next/head";
import NextLink from "next/link";
import { ReactNode } from "react";

import Layout from "../components/layout";
import { Locale } from "../lib/enums/locals.enum";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getGeneralSettings, IGeneralSettings } from "../lib/general-settings";
import { getMenu, IMenuItem } from "../lib/menu";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getNotificationList, INotification } from "../lib/notification";
import { getPartnerList, IPartner } from "../lib/partner";

interface Custom404Props {
  notificationList: INotification[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  newsList: INewsLink[];
  generalSettings: IGeneralSettings;
  messages: unknown;
}

export const getStaticProps = async ({
  locale = Locale.DE,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<Custom404Props>> => {
  const messages = await import(`../messages/${locale}.json`).then(
    (module) => module.default,
  );

  return {
    props: {
      notificationList: await getNotificationList(locale),
      sponsorList: await getPartnerList(PartnerCategory.SPONSOR),
      mediaPartnerList: await getPartnerList(PartnerCategory.MEDIA_PARTNER),
      additionalList: await getPartnerList(PartnerCategory.ADDITIONAL),
      menuItems: await getMenu(),
      newsList: await getNewsLinkList(locale),
      generalSettings: await getGeneralSettings(locale),
      messages: messages,
    },
    revalidate: 1,
  };
};

const Custom404 = ({
  notificationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
  generalSettings,
}: Custom404Props): ReactNode => {
  const t = useTranslations("404");

  return (
    <Layout
      notifcationList={notificationList}
      sponsorList={sponsorList}
      mediaPartnerList={mediaPartnerList}
      additionalList={additionalList}
      menuItems={menuItems}
      newsList={newsList}
      ticketshopUrl={generalSettings.ticketshopUrl}
      generalSettings={generalSettings}
    >
      <NextHead>
        <title>{generalSettings.websiteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <div className="px-7 pt-20 text-center">
        <h1 className="font-important text-3xl">{t("title")}</h1>
        <p className="font-content">
          {t("text-part-1")}
          <br />
          {t("text-part-2")}
          <NextLink href="/">{t("link-text")}</NextLink> {t("text-part-3")}
        </p>
      </div>
    </Layout>
  );
};

export default Custom404;
