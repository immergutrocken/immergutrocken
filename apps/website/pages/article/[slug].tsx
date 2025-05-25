import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import NextHead from "next/head";
import NextImage from "next/image";
import { ParsedUrlQuery } from "querystring";
import { ReactNode } from "react";

import Content from "../../components/block-content/content";
import Layout from "../../components/layout";
import Label from "../../components/shared/label";
import { getArticle, getArticleSlugList, IArticle } from "../../lib/article";
import { Locale } from "../../lib/enums/locals.enum";
import PartnerCategory from "../../lib/enums/partnerCategory.enum";
import {
  getGeneralSettings,
  IGeneralSettings,
} from "../../lib/general-settings";
import { getMenu, IMenuItem } from "../../lib/menu";
import { getNewsLinkList, INewsLink } from "../../lib/news";
import { getNotificationList, INotification } from "../../lib/notification";
import { getPartnerList, IPartner } from "../../lib/partner";

interface ArticleParams extends ParsedUrlQuery {
  slug: string;
}

interface ArticleProps extends IArticle {
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
  GetStaticPathsResult<ArticleParams>
> => {
  const slugs = await getArticleSlugList();
  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps = async ({
  params,
  locale = Locale.DE,
}: GetStaticPropsContext<ArticleParams>): Promise<
  GetStaticPropsResult<ArticleProps>
> => {
  let article: IArticle;
  console.log(locale);
  try {
    if (params?.slug == null) throw new Error("No slug provided");
    article = await getArticle(params?.slug, locale);
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }

  const messages = await import(`../../messages/${locale}.json`).then(
    (module) => module.default,
  );

  return {
    props: {
      ...article,
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

const Article = ({
  title,
  subtitle,
  banner,
  content,
  author,
  notificationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsList,
  generalSettings,
}: ArticleProps): ReactNode => {
  const t = useTranslations("Article");

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
      <NextSeo
        title={`${title} &minus; ${generalSettings.websiteTitle}`}
        openGraph={{
          images: [
            {
              url: banner.url,
              type: "image/png",
              height: 300,
              width: 300,
            },
          ],
        }}
      />
      <NextHead>
        <link rel="icon" href="/favicon.ico" />
        <title>{`${title} - ${generalSettings.websiteTitle}`}</title>
      </NextHead>
      <div className="grid h-full grid-cols-1 sm:grid-cols-2 sm:space-x-5 sm:px-6 sm:pt-6">
        <div
          className={`relative top-9 flex items-center sm:sticky sm:top-0 sm:h-full sm:max-h-screen`}
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
        <div className="px-4 pb-5 pt-14 sm:pb-5 sm:pt-32">
          <h1 className="font-important text-4xl sm:text-7xl">{title}</h1>
          {subtitle != null && (
            <h2 className="mt-2 font-important text-xl sm:text-4xl">
              {subtitle}
            </h2>
          )}
          <div className="mt-5 flex flex-row items-center space-x-4 sm:mt-8 sm:text-3xl">
            <Label>{t("photo").toString()}</Label>
            <span className="font-important">{banner.credits}</span>
          </div>
          {author && (
            <div className="mt-2 flex flex-row items-center space-x-4 sm:mt-4 sm:text-3xl">
              <Label>{t("text").toString()}</Label>
              <span className="font-important">{author}</span>
            </div>
          )}
          <div className="mt-5 font-content">
            <Content content={content} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Article;
