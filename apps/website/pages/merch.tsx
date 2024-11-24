import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { NextSeo } from "next-seo";
import NextHead from "next/head";
import Image from "next/image";
import { useState } from "react";

import Content from "../components/block-content/content";
import Layout from "../components/layout";
import Bubble from "../components/shared/bubble";
import Label from "../components/shared/label";
import LightBox from "../components/shared/lightbox";
import { Locale } from "../lib/enums/locals.enum";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getGeneralSettings, IGeneralSettings } from "../lib/general-settings";
import { getMenu, IMenuItem } from "../lib/menu";
import { getMerch } from "../lib/merch";
import { IProduct } from "../lib/models/product.interface";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getNotificationList, INotification } from "../lib/notification";
import { getPartnerList, IPartner } from "../lib/partner";
import { SanityImage } from "../lib/shared/sanity-image-url";

interface MerchProps {
  description: [];
  products: IProduct[];
  newsLinkList: INewsLink[];
  menuItems: IMenuItem[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  notificationList: INotification[];
  generalSettings: IGeneralSettings;
  messages: unknown;
}

export const getStaticProps = async ({
  locale = Locale.DE,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<MerchProps>> => {
  const merch = await getMerch(locale);
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
      notificationList: await getNotificationList(locale),
      generalSettings: await getGeneralSettings(locale),
      messages: messages,
      description: merch?.description ?? [],
      products: merch?.productList ?? [],
    },
    revalidate: 1,
  };
};

const Merch = ({
  notificationList,
  sponsorList,
  mediaPartnerList,
  additionalList,
  menuItems,
  newsLinkList,
  generalSettings,
  description,
  products,
}: MerchProps): JSX.Element => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentLightboxImages, setCurrentLightboxImages] = useState<
    SanityImage[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(0);

  return (
    <Layout
      notifcationList={notificationList}
      sponsorList={sponsorList}
      mediaPartnerList={mediaPartnerList}
      additionalList={additionalList}
      menuItems={menuItems}
      newsList={newsLinkList}
      showNewsList={true}
      ticketshopUrl={generalSettings.ticketshopUrl}
      generalSettings={generalSettings}
    >
      <NextSeo
        title={"Merch &minus; " + generalSettings.websiteTitle}
        openGraph={{
          images: [
            {
              url: generalSettings.bannerDesktop.url,
              type: "image/png",
            },
          ],
        }}
      />
      <NextHead>
        <link rel="icon" href="/favicon.ico" />
        <title>{"Merch - " + generalSettings.websiteTitle}</title>
      </NextHead>
      <div className="flex flex-col items-center px-4 pt-24 sm:px-8 sm:pt-36">
        <div>
          <h1 className="self-start font-important text-4xl sm:text-7xl">
            Merch
          </h1>
          <Content content={description} />
        </div>
        <div className="mt-10 flex max-w-[1296px] flex-wrap place-content-center gap-4 sm:gap-8">
          {products.map((product, index) => {
            return (
              <div className="w-1/5 min-w-[300px] max-w-[300px]" key={index}>
                <div
                  className="relative cursor-pointer"
                  onClick={() => {
                    setShowLightbox(true);
                    setCurrentLightboxImages(product.images);
                    setCurrentImageIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "enter") {
                      setShowLightbox(true);
                      setCurrentLightboxImages(product.images);
                      setCurrentImageIndex(0);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Image
                    src={product.images[0].urlPreview}
                    width={300}
                    height={300}
                    alt={product.title}
                    placeholder="blur"
                    blurDataURL={product.images[0].urlPreviewBlur}
                  ></Image>
                  <Bubble className="absolute right-1 top-1" size="small">
                    <em className="fas fa-expand-alt"></em>
                  </Bubble>
                </div>
                <h2 className="font-important text-base sm:text-2xl">
                  {product.title}
                </h2>
                <div className="mb-2 mt-2 flex">
                  <Label>{product.category}</Label>
                </div>
                <Content content={product.description} />
              </div>
            );
          })}
        </div>
      </div>
      <>
        {showLightbox && (
          <LightBox
            images={currentLightboxImages}
            imageIndex={currentImageIndex}
            show={showLightbox}
            onShow={setShowLightbox}
            onCurrentImageIndexChange={setCurrentImageIndex}
          ></LightBox>
        )}
      </>
    </Layout>
  );
};

export default Merch;
