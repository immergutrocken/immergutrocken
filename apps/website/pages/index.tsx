import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import NextHead from "next/head";
import NextImage from "next/image";
import NextLink from "next/link";
import { useState } from "react";
import Layout from "../components/layout";
import Button from "../components/shared/button";
import Label from "../components/shared/label";
import { getArtistLinkList, IArtistLink } from "../lib/artist";
import { ArtistCategory } from "../lib/enums/artistCategory.enum";
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
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> => {
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
      messages: require(`../messages/${locale}.json`),
    },
    revalidate: 1,
  };
};

const buildArtistLinkPairList = (
  artistLinkList: IArtistLink[]
): IArtistLink[][] => {
  const artistLinkPairList = [];
  artistLinkList.forEach((artistLink, index, originalArray) => {
    if (index % 2 === 0) {
      if (originalArray[index + 1] === undefined)
        artistLinkPairList.push([artistLink]);
      else artistLinkPairList.push([artistLink, originalArray[index + 1]]);
    }
  });
  return artistLinkPairList;
};

const getArtistTextColor = (
  linkPairIndex: number,
  linkIndex: number
): string => {
  console.log("nice");
  if (linkPairIndex % 2 === 0) {
    if (linkIndex === 0) return "text-ciPurple";
    else return "text-ciOrange";
  } else {
    if (linkIndex === 0) return "text-ciPurple sm:text-ciOrange";
    else return "text-ciOrange sm:text-ciPurple";
  }
};

export default function Home(props: HomeProps): JSX.Element {
  const [filterCategory, setFilterCategory] = useState<ArtistCategory>(null);
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
      <div className={`block sm:hidden${showNewsList ? " pt-9" : ""}`}>
        <NextImage
          src={props.generalSettings.bannerMobile.url}
          width={1800}
          height={2250}
          layout="responsive"
          placeholder="blur"
          blurDataURL={props.generalSettings.bannerMobile.urlWithBlur}
        />
      </div>
      <div className={`hidden sm:block${showNewsList ? " sm:pt-10" : ""}`}>
        <NextImage
          src={props.generalSettings.bannerDesktop.url}
          height={1336}
          width={3280}
          layout="responsive"
          placeholder="blur"
          blurDataURL={props.generalSettings.bannerDesktop.urlWithBlur}
        />
      </div>
      <div className="flex justify-center pt-4 sm:pt-6">
        {props.generalSettings.showNewsAsPrimaryContent && (
          <Label>{t("news")}</Label>
        )}
        {!props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {props.artistLinkList.some(
              (link) => link.category === ArtistCategory.MUSIC
            ) && (
              <Button
                className="mx-2"
                click={() =>
                  setFilterCategory(
                    filterCategory === ArtistCategory.MUSIC
                      ? null
                      : ArtistCategory.MUSIC
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
              (link) => link.category === ArtistCategory.READING
            ) && (
              <Button
                className="mx-2"
                click={() =>
                  setFilterCategory(
                    filterCategory === ArtistCategory.READING
                      ? null
                      : ArtistCategory.READING
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
      <div className="flex flex-col justify-center py-4 text-3xl text-center sm:max-w-7xl sm:py-6 sm:text-5xl font-important sm:mx-auto">
        {!props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {buildArtistLinkPairList(props.artistLinkList).map(
              (linkPair, indexLinkPair) => (
                <div
                  key={indexLinkPair}
                  className={`flex flex-col sm:flex-row items-center justify-center w100`}
                >
                  {linkPair.map((link, index) => (
                    <div
                      className="flex items-center justify-center flex-grow mt-1 sm:mt-2 sm:w-1/2"
                      key={index}
                    >
                      <NextLink key={index} href={`/artist/${link.slug}`}>
                        <a
                          className={`mx-2 sm:mx-5 w100
                              ${
                                filterCategory !== null &&
                                link.category !== filterCategory
                                  ? "text-gray-300"
                                  : getArtistTextColor(indexLinkPair, index)
                              }`}
                        >
                          {link.title}
                        </a>
                      </NextLink>
                    </div>
                  ))}
                </div>
              )
            )}
            {props.generalSettings.additionalTextAfterArtists && (
              <div className="flex items-center justify-center w100">
                {props.generalSettings.additionalTextAfterArtists}
              </div>
            )}
          </>
        )}
        {props.generalSettings.showNewsAsPrimaryContent && (
          <>
            {props.newsLinkList.map((link, index, array) => (
              <span key={index}>
                <NextLink href={`/article/${link.slug}`}>
                  <a className="mx-2 sm:mx-5">{link.title}</a>
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
