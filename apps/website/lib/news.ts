import groq from "groq";

import { sanityClient } from "./shared/sanity-client";

export interface INewsLink {
  title: string;
  slug: string;
}

export const getNewsLinkList = async (locale: string): Promise<INewsLink[]> => {
  const query = groq`
  *
  [_type == 'sortings'] {
    'titleDe': news[]->languages.de.title,
    'titleEn': news[]-> languages.en.title,
    'slug': news[]->slug.current
    }`;
  const result = await sanityClient.fetch(query);
  const newsLinkList = result[0].slug.map(
    (slug: string, index: number): INewsLink => ({
      title:
        locale === "en" && result[0].titleEn[index]
          ? result[0].titleEn[index]
          : result[0].titleDe[index],
      slug: slug,
    }),
  );
  return newsLinkList;
};
