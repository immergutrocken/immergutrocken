import NextHead from "next/head";
import NextImage from "next/image";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getPartnerList, IPartner } from "../lib/partner";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getMenu, IMenuItem } from "../lib/menu";
import { getArtistLinkList, IArtistLink } from "../lib/artist";
import NextLink from "next/link";
import Layout from "../components/layout";
import { getNotificationList, INotification } from "../lib/notification";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useTranslations } from "next-intl";
import bannerMobile from "../public/images/ig-website-mobile-cd.png";
import bannerDesktop from "../public/images/ig-website-desktop-cd.png";
// import { ArtistCategory } from "../lib/enums/artistCategory.enum";
// import Button from "../components/shared/button";
// import { useState } from "react";
import Label from "../components/shared/label";
import { NextSeo } from "next-seo";

interface HomeProps {
  newsLinkList: INewsLink[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  artistLinkList: IArtistLink[];
  notificationList: INotification[];
  newsList: INewsLink[];
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
      messages: require(`../messages/${locale}.json`),
    },
    revalidate: 1,
  };
};

export default function Home(props: HomeProps): JSX.Element {
  // const [filterCategory, setFilterCategory] = useState<ArtistCategory>(null);
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
      showNewsList={showNewsList}
    >
      <NextHead>
        <title>{t("festival")}</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <NextSeo
        title={t("festival")}
        openGraph={{
          images: [
            {
              url: bannerDesktop.src,
              type: "image/png",
            },
          ],
        }}
      />
      <div className={`block ${showNewsList ? "pt-9" : ""} sm:hidden`}>
        <NextImage
          src={bannerMobile}
          width={bannerMobile.width}
          height={bannerMobile.height}
          layout="responsive"
          placeholder="blur"
        />
      </div>
      <div className={`hidden ${showNewsList ? "sm:pt-10" : ""} sm:block`}>
        <NextImage
          src={bannerDesktop}
          width={bannerDesktop.width}
          height={bannerDesktop.height}
          layout="responsive"
          placeholder="blur"
        />
      </div>
      <div className="flex justify-center mt-4 sm:mt-6">
        <Label>{t("news")}</Label>
        {/* {props.artistLinkList.some(
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
              filterCategory === ArtistCategory.MUSIC || filterCategory === null
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
        )} */}
      </div>
      <div className="flex flex-row flex-wrap justify-center mt-4 text-3xl text-center sm:mt-6 sm:text-5xl font-important">
        {/* {props.artistLinkList
          .filter((link) =>
            filterCategory === null ? true : link.category === filterCategory
          )
          .map((link, index, array) => (
            <span key={index}>
              <NextLink href={`/artist/${link.slug}`}>
                <a className="mx-2 sm:mx-5">{link.title}</a>
              </NextLink>
              {index === array.length - 1 ? "" : "•"}
            </span>
          ))} */}
        {props.newsLinkList.map((link, index, array) => (
          <span key={index}>
            <NextLink href={`/article/${link.slug}`}>
              <a className="mx-2 sm:mx-5">{link.title}</a>
            </NextLink>
            {index === array.length - 1 ? "" : "•"}
          </span>
        ))}
      </div>
    </Layout>
  );
}
