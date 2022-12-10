import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import Image from "next/image";
import Content from "../components/block-content/content";
import Layout from "../components/layout";
import Label from "../components/shared/label";
import PartnerCategory from "../lib/enums/partnerCategory.enum";
import { getMenu, IMenuItem } from "../lib/menu";
import { getMerch } from "../lib/merch";
import { IProduct } from "../lib/models/product.interface";
import { getNewsLinkList, INewsLink } from "../lib/news";
import { getNotificationList, INotification } from "../lib/notification";
import { getPartnerList, IPartner } from "../lib/partner";

interface MerchProps {
  description: [];
  products: IProduct[];
  newsLinkList: INewsLink[];
  menuItems: IMenuItem[];
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  notificationList: INotification[];
  messages: unknown;
}

export const getStaticProps = async ({
  locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<MerchProps>> => {
  const merch = await getMerch(locale);
  return {
    props: {
      newsLinkList: await getNewsLinkList(locale),
      sponsorList: await getPartnerList(PartnerCategory.SPONSOR),
      mediaPartnerList: await getPartnerList(PartnerCategory.MEDIA_PARTNER),
      additionalList: await getPartnerList(PartnerCategory.ADDITIONAL),
      menuItems: await getMenu(),
      notificationList: await getNotificationList(locale),
      messages: require(`../messages/${locale}.json`),
      description: merch.description,
      products: merch.productList,
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
  description = [],
  products = [],
}: MerchProps): JSX.Element => {
  return (
    <Layout
      notifcationList={notificationList}
      sponsorList={sponsorList}
      mediaPartnerList={mediaPartnerList}
      additionalList={additionalList}
      menuItems={menuItems}
      newsList={newsLinkList}
      showNewsList={true}
    >
      <div className="flex flex-col items-center px-4 pt-24 sm:px-8 sm:pt-36">
        <h1 className="text-4xl sm:text-7xl font-important">Merch</h1>
        <Content content={description} />
        <div className="flex flex-wrap gap-4 mt-10 sm:gap-8 place-content-center">
          {products.map((product, index) => {
            return (
              <div className="w-1/5 min-w-[300px]" key={index}>
                <Image
                  src={product.images[0].urlPreview}
                  width={300}
                  height={300}
                  alt={product.title}
                ></Image>
                <h2 className="text-2xl sm:text-4xl font-important">
                  {product.title}
                </h2>
                <div className="flex mt-2 mb-2">
                  <Label>{product.category}</Label>
                </div>
                <Content content={product.description} />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Merch;
