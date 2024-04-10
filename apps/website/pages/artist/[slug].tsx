import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { useTranslations } from 'next-intl';
import { NextSeo } from 'next-seo';
import NextHead from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import Content from '../../components/block-content/content';
import Layout from '../../components/layout';
import Bubble from '../../components/shared/bubble';
import Label from '../../components/shared/label';
import Link from '../../components/shared/link';
import { getArtist, getArtistList, IArtist } from '../../lib/artist';
import { Locale } from '../../lib/enums/locals.enum';
import PartnerCategory from '../../lib/enums/partnerCategory.enum';
import { SocialMedia } from '../../lib/enums/socialMedia.enum';
import { getGeneralSettings, IGeneralSettings } from '../../lib/general-settings';
import { getMenu, IMenuItem } from '../../lib/menu';
import { getNewsLinkList, INewsLink } from '../../lib/news';
import { getNotificationList, INotification } from '../../lib/notification';
import { getPartnerList, IPartner } from '../../lib/partner';

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
  generalSettings: IGeneralSettings;
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
  locale = Locale.DE,
}: GetStaticPropsContext<ArtistParams>): Promise<
  GetStaticPropsResult<ArtistProps>
> => {
  let artist: IArtist;
  try {
    if (params?.slug == null) throw new Error("No slug provided");
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
      generalSettings: await getGeneralSettings(locale),
      messages: require(`../../messages/${locale}.json`),
    },
    revalidate: 1,
  };
};

const iconMapping = new Map<SocialMedia, string>([
  [SocialMedia.WEBSITE, "fas fa-globe"],
  [SocialMedia.YOUTUBE, "fab fa-youtube"],
  [SocialMedia.FACEBOOK, "fab fa-facebook-f"],
  [SocialMedia.TWITTER, "fab fa-x-twitter"],
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
  performance,
  socialMedia,
  content,
  notificationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
  generalSettings,
}: ArtistProps): JSX.Element => {
  const router = useRouter();
  const t = useTranslations("Article");
  const performanceDate = performance?.time ? new Date(performance.time) : null;

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
      <NextSeo
        title={`${title} &minus; ${generalSettings.websiteTitle}`}
        openGraph={{
          images: [
            {
              url: banner.url,
              type: "image/png",
            },
          ],
        }}
      />
      <NextHead>
        <link rel="icon" href="/favicon.ico" />
        <title>{`${title} - ${generalSettings.websiteTitle}`}</title>
      </NextHead>
      <div className="grid h-full grid-cols-1 lg:grid-cols-2 lg:space-x-5 lg:px-6 lg:pt-6">
        <div
          className={`relative top-9 lg:sticky lg:top-0 lg:max-h-screen lg:h-full flex items-center`}
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
          <h1 className="text-4xl text-center sm:text-7xl font-important">
            {title}
          </h1>
          <div className="grid items-center grid-cols-2 mt-5 sm:mt-8 sm:text-3xl gap-x-4 gap-y-2">
            {author && (
              <>
                <Label className="text-right">{t("photo").toString()}</Label>
                <span className="text-left font-important">
                  {banner.credits}
                </span>
              </>
            )}
            {author && (
              <>
                <Label className="text-right">{t("text").toString()}</Label>
                <span className="text-left font-important">{author}</span>
              </>
            )}
            {generalSettings.isPerformanceDetailsVisible &&
              performance?.stage && (
                <>
                  <Label className="text-right">{t("stage").toString()}</Label>
                  <span className="text-left font-important">
                    {performance.stage}
                  </span>
                </>
              )}
            {generalSettings.isPerformanceDetailsVisible &&
              performance?.time && (
                <>
                  <Label className="text-right">{t("time").toString()}</Label>
                  <span className="text-left font-important">
                    {performanceDate?.toLocaleString(router.locale, {
                      weekday: "long",
                      hour: "numeric",
                      minute: "numeric",
                    })}{" "}
                    {router.locale === "de" ? "Uhr" : ""}
                  </span>
                </>
              )}
          </div>
          <div className="flex flex-row flex-wrap justify-center mt-3 sm:mt-6">
            {socialMedia.map((element, index) => (
              <Link
                href={element.url}
                key={index}
                className="mb-3 mr-2 sm:mr-3 sm:mb-2 hover:no-underline"
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
