import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import groq from "groq";
import PartnerCategory from "./enums/partnerCategory.enum";
import client from "./shared/sanityClient";
import { SanityImage, getImageUrl } from "./shared/sanityImageUrl";

export interface IPartner {
  link: string;
  logo: SanityImage & {
    alt: string;
    asset: SanityImageSource;
    credits: string;
    height: number;
    width: number;
    url: string;
  };
}

export const getPartnerList = async (
  category: PartnerCategory
): Promise<IPartner[]> => {
  const query = groq`*[_type == 'sortings'] {'link': ${category}[]->link.url, 'logo': ${category}[]->logo}`;
  const result = await client.fetch(query);
  const partnerList = result[0].link.map(
    (link: string, index: number): IPartner => ({
      link: link,
      logo: result[0].logo[index],
    })
  );
  return partnerList.map((p: IPartner) => {
    return {
      ...p,
      logo: {
        ...p.logo,
        url: getImageUrl(p.logo, p.logo.height, p.logo.width),
      },
    } as IPartner;
  });
};
