import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";
import Layout from "../../components/layout";
import { getArtist, getArtistList, IArtist } from "../../lib/artist";
import NextImage from "next/image";
import Label from "../../components/shared/label";
import Bubble from "../../components/shared/bubble";
import Link from "../../components/shared/link";
import { SocialMedia } from "../../lib/enums/socialMedia.enum";
import NextHead from "next/head";
import { getNotificationList, INotification } from "../../lib/notification";
import Content from "../../components/block-content/content";
import { useTranslations } from "next-intl";
import { getPartnerList, IPartner } from "../../lib/partner";
import PartnerCategory from "../../lib/enums/partnerCategory.enum";
import { getMenu, IMenuItem } from "../../lib/menu";
import { getNewsLinkList, INewsLink } from "../../lib/news";
import { NextSeo } from "next-seo";

interface ArtistParams extends ParsedUrlQuery {
  slug: string;
}

interface ArtistProps extends IArtist {
  notificationList: INotification[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  menuItems: IMenuItem[];
  newsList: INewsLink[];
  messages: unknown;
}

export const getStaticPaths = async (): Promise<
  GetStaticPathsResult<ArtistParams>
> => {
  const artistLinkList = await getArtistList();
  return {
    paths: artistLinkList
      .map((item) => ({
        params: {
          slug: item.slug,
        },
        locale: "de",
      }))
      .concat(
        artistLinkList.map((item) => ({
          params: {
            slug: item.slug,
          },
          locale: "en",
        }))
      ),
    fallback: "blocking",
  };
};

export const getStaticProps = async ({
  params,
  locale,
}: GetStaticPropsContext<ArtistParams>): Promise<
  GetStaticPropsResult<ArtistProps>
> => {
  let artist: IArtist;
  try {
    artist = await getArtist(params.slug, locale);
  } catch {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...artist,
      notificationList: await getNotificationList(locale),
      sponsorList: await getPartnerList(PartnerCategory.SPONSOR),
      mediaPartnerList: await getPartnerList(PartnerCategory.MEDIA_PARTNER),
      additionalList: await getPartnerList(PartnerCategory.ADDITIONAL),
      menuItems: await getMenu(),
      newsList: await getNewsLinkList(locale),
      messages: require(`../../messages/${locale}.json`),
    },
    revalidate: 1,
  };
};

const iconMapping = new Map<SocialMedia, string>([
  [SocialMedia.WEBSITE, "fas fa-globe"],
  [SocialMedia.YOUTUBE, "fab fa-youtube"],
  [SocialMedia.FACEBOOK, "fab fa-facebook-f"],
  [SocialMedia.TWITTER, "fab fa-twitter"],
  [SocialMedia.INSTAGRAM, "fab fa-instagram"],
  [SocialMedia.VIMEO, "fab fa-vimeo"],
  [SocialMedia.TIKTOK, "fab fa-tiktok"],
  [SocialMedia.SPOTIFY, "fab fa-spotify"],
  [SocialMedia.LABEL, "fas fa-compact-disc"],
]);

const Artist = ({
  title,
  banner,
  author,
  socialMedia,
  content,
  notificationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
}: ArtistProps): JSX.Element => {
  const t = useTranslations("Article");

  return (
    <Layout
      notifcationList={notificationList}
      sponsorList={sponsorList}
      mediaPartnerList={mediaPartnerList}
      additionalList={additionalList}
      menuItems={menuItems}
      newsList={newsList}
    >
      <NextHead>
        <title>{`${title} - ${t("festival")}`}</title>
      </NextHead>
      <NextSeo
        title={`${title} &minus; ${t("festival")}`}
        openGraph={{
          images: [
            {
              url: banner.url,
              type: "image/png",
            },
          ],
        }}
      />
      <div className="grid h-full grid-cols-1 sm:grid-cols-2 sm:space-x-5 sm:px-6 sm:pt-6">
        <div
          className={`relative top-9 sm:sticky sm:top-0 sm:max-h-screen sm:h-full flex items-center`}
        >
          <NextImage
            src={banner.url}
            width="1000"
            height="1000"
            alt={banner.alt}
            placeholder="blur"
            blurDataURL={banner.urlWithBlur}
          />
        </div>
        <div className="px-4 pb-5 pt-14 sm:pt-32 sm:pb-5">
          <h1 className="text-4xl sm:text-7xl sm:text-center font-important">
            {title}
          </h1>
          <div className="flex flex-row mt-5 space-x-4 sm:mt-8 sm:justify-center sm:text-3xl">
            <Label>{t("photo").toString()}</Label>
            <span className="font-important">{banner.credits}</span>
          </div>
          {author && (
            <div className="flex flex-row mt-2 space-x-4 sm:mt-4 sm:justify-center sm:text-3xl">
              <Label>{t("text").toString()}</Label>
              <span className="font-important">{author}</span>
            </div>
          )}
          <div className="flex flex-row flex-wrap mt-3 sm:mt-6 sm:justify-center">
            {socialMedia.map((element, index) => (
              <Link
                href={element.url}
                key={index}
                className="mb-3 mr-2 sm:mr-3 sm:mb-2"
              >
                <Bubble>
                  <em className={iconMapping.get(element.type)}></em>
                </Bubble>
              </Link>
            ))}
          </div>
          <div className="mt-5 font-content sm:text-center">
            <Content content={content} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Artist;
