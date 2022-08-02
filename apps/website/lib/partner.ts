import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import client from "./shared/sanityClient";
import { urlFor } from "./shared/sanityImageUrl";
import PartnerCategory from "./enums/partnerCategory.enum";
import groq from "groq";

export interface IPartner {
  link: string;
  logo: {
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
        url: urlFor(p.logo.asset)
          .width(p.logo.width)
          .height(p.logo.height)
          .url(),
      },
    } as IPartner;
  });
};
