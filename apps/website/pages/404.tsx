import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useTranslations } from "use-intl";
import Layout from "../components/layout";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getMenu, IMenuItem } from "../lib/menu";
import { getNotificationList, INotification } from "../lib/notification";
import { getPartnerList, IPartner } from "../lib/partner";
import NextHead from "next/head";
import NextLink from "next/link";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getGeneralSettings, IGeneralSettings } from "../lib/general-settings";
import { Locale } from "../lib/enums/locals.enum";

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
  return {
    props: {
      notificationList: await getNotificationList(locale),
      sponsorList: await getPartnerList(PartnerCategory.SPONSOR),
      mediaPartnerList: await getPartnerList(PartnerCategory.MEDIA_PARTNER),
      additionalList: await getPartnerList(PartnerCategory.ADDITIONAL),
      menuItems: await getMenu(),
      newsList: await getNewsLinkList(locale),
      generalSettings: await getGeneralSettings(locale),
      messages: require(`../messages/${locale}.json`),
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
}: Custom404Props): JSX.Element => {
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
    >
      <NextHead>
        <title>{generalSettings.websiteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <div className="pt-20 text-center px-7">
        <h1 className="text-3xl font-important">{t("title")}</h1>
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
