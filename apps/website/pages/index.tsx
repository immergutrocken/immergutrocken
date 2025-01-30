import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import NextHead from "next/head";
import NextImage from "next/image";
import NextLink from "next/link";
import { ReactNode, useState } from "react";

import Layout from "../components/layout";
import Button from "../components/shared/button";
import Label from "../components/shared/label";
import { getArtistLinkList, IArtistLink } from "../lib/artist";
import { ArtistCategory } from "../lib/enums/artistCategory.enum";
import { Locale } from "../lib/enums/locals.enum";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getGeneralSettings, IGeneralSettings } from "../lib/general-settings";
import { getMenu, IMenuItem } from "../lib/menu";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getNotificationList, INotification } from "../lib/notification";
import { getPartnerList, IPartner } from "../lib/partner";

interface HomeProps {
  newsLinkList: INewsLink[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  artistLinkList: IArtistLink[];
  notificationList: INotification[];
  newsList: INewsLink[];
  generalSettings: IGeneralSettings;
  messages: unknown;
}

export const getStaticProps = async ({
  locale = Locale.DE,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> => {
  const messages = await import(`../messages/${locale}.json`).then(
    (module) => module.default,
  );

  return {
    props: {
      newsLinkList: await getNewsLinkList(locale),
      sponsorList: await getPartnerList(PartnerCategory.SPONSOR),
      mediaPartnerList: await getPartnerList(PartnerCategory.MEDIA_PARTNER),
      additionalList: await getPartnerList(PartnerCategory.ADDITIONAL),
      menuItems: await getMenu(),
      artistLinkList: await getArtistLinkList(locale),
      notificationList: await getNotificationList(locale),
      newsList: await getNewsLinkList(locale),
      generalSettings: await getGeneralSettings(locale),
      messages: messages,
    },
    revalidate: 1,
  };
};

export default function Home(props: HomeProps): ReactNode {
  const [filterCategory, setFilterCategory] = useState<ArtistCategory | null>(
    null,
  );
  const t = useTranslations("Home");
  const showNewsList = false;

  return (
    <Layout
      notifcationList={props.notificationList}
      sponsorList={props.sponsorList}
      mediaPartnerList={props.mediaPartnerList}
      additionalList={props.additionalList}
      menuItems={props.menuItems}
      newsList={props.newsLinkList}
      showNewsList={!props.generalSettings.showNewsAsPrimaryContent}
      ticketshopUrl={props.generalSettings.ticketshopUrl}
      generalSettings={props.generalSettings}
    >
      <NextHead>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <NextSeo
        title={props.generalSettings.websiteTitle}
        openGraph={{
          images: [
            {
              url: props.generalSettings.bannerDesktop.url,
              type: "image/png",
            },
          ],
        }}
      />
      <div className={`block sm:hidden${showNewsList ? "pt-9" : ""}`}>
        <NextImage
          src={props.generalSettings.bannerMobile.url}
          width={1800}
          height={2250}
          style={{
            fill: "responsive",
          }}
          placeholder="blur"
          blurDataURL={props.generalSettings.bannerMobile.urlWithBlur}
          alt="Banner"
        />
      </div>
      <div className={`hidden sm:block${showNewsList ? "sm:pt-10" : ""}`}>
        <NextImage
          src={props.generalSettings.bannerDesktop.url}
          height={1336}
          width={3280}
          style={{
            fill: "responsive",
          }}
          placeholder="blur"
          blurDataURL={props.generalSettings.bannerDesktop.urlWithBlur}
          alt="Banner"
        />
      </div>
      <div className="mt-4 flex justify-center sm:mt-6">
        {props.generalSettings.showNewsAsPrimaryContent && (
          <Label>{t("news")}</Label>
        )}
        {!props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {props.artistLinkList.some(
              (link) => link.category === ArtistCategory.MUSIC,
            ) && (
              <Button
                className="mx-2"
                click={() =>
                  setFilterCategory(
                    filterCategory === ArtistCategory.MUSIC
                      ? null
                      : ArtistCategory.MUSIC,
                  )
                }
                active={
                  filterCategory === ArtistCategory.MUSIC ||
                  filterCategory === null
                }
                size="small"
              >
                {t("music").toString()}
              </Button>
            )}
            {props.artistLinkList.some(
              (link) => link.category === ArtistCategory.READING,
            ) && (
              <Button
                className="mx-2"
                click={() =>
                  setFilterCategory(
                    filterCategory === ArtistCategory.READING
                      ? null
                      : ArtistCategory.READING,
                  )
                }
                active={
                  filterCategory === ArtistCategory.READING ||
                  filterCategory === null
                }
                size="small"
              >
                {t("readings").toString()}
              </Button>
            )}
          </>
        )}
      </div>
      <div className="mt-4 flex flex-row flex-wrap justify-center text-center font-important text-3xl sm:mt-6 sm:text-5xl">
        {!props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {props.artistLinkList.map((link, index, array) => (
              <span key={index}>
                <NextLink
                  href={`/artist/${link.slug}`}
                  className={`mx-2 sm:mx-5${
                    filterCategory != null && link.category !== filterCategory
                      ? "text-gray-300"
                      : ""
                  }`}
                >
                  {link.title}
                </NextLink>
                {index === array.length - 1 ? "" : "•"}
              </span>
            ))}
            {props.generalSettings.additionalTextAfterArtists && (
              <span> • {props.generalSettings.additionalTextAfterArtists}</span>
            )}
          </>
        )}
        {props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {props.newsLinkList.map((link, index, array) => (
              <span key={index}>
                <NextLink
                  href={`/article/${link.slug}`}
                  className="mx-2 sm:mx-5"
                >
                  {link.title}
                </NextLink>
                {index === array.length - 1 ? "" : "•"}
              </span>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
}
