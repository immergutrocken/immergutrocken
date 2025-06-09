import groq from "groq";

import { IMerch } from "./models/merch.interface";
import { sanityClient } from "./shared/sanity-client";
import {
  getImageUrl,
  getPlaceholderImage,
  SanityImage,
} from "./shared/sanity-image-url";

export const getMerch = async (locale: string): Promise<IMerch> => {
  // const query = groq`*[_type == "merch"]{
  //     "description": languages.${locale}.description[],
  //     "productList": products[]{
  //       "title": languages.${locale}.title,
  //       "category": languages.${locale}.category,
  //       "description": languages.${locale}.description[],
  //       "images": images[]
  //     }
  //   }`;

  const query = groq`*[_type == "merch"]{
      "descriptionDe": languages.de.description[],
      "descriptionEn": languages.en.description[],
      "productList": products[]{
        "titleDe": languages.de.title,
        "titleEn": languages.en.title,
        "categoryDe": languages.de.category,
        "categoryEn": languages.en.category,
        "descriptionDe": languages.en.description[],
        "descriptionEn": languages.en.description[],
        "images": images[]
      }
    }`;
  const merchResponse = (await sanityClient.fetch(query))[0];

  if (!merchResponse) {
    return Promise.reject("No merch found");
  }

  const isEnCurrentLocale = locale === "en";
  const result: IMerch = {
    description:
      isEnCurrentLocale && !!merchResponse.descriptionEn
        ? merchResponse.descriptionEn
        : merchResponse.descriptionDe,
    productList: merchResponse.productList?.map(
      (p: {
        titleDe: string;
        titleEn: string;
        categoryDe: string;
        categoryEn: string;
        descriptionDe: string;
        descriptionEn: string;
        images: SanityImage[];
      }) => ({
        title: isEnCurrentLocale && !!p.titleEn ? p.titleEn : p.titleDe,
        category:
          isEnCurrentLocale && !!p.categoryEn ? p.categoryEn : p.categoryDe,
        description:
          isEnCurrentLocale && !!p.descriptionEn
            ? p.descriptionEn
            : p.descriptionDe,
        images: p.images,
      }),
    ),
  };

  const imageSizePreview = 300;
  const imageSize = 1000;
  result.productList?.forEach((product) => {
    product.images.forEach(async (image: SanityImage, index: number) => {
      if (index === 0) {
        image.urlPreview = getImageUrl(
          image,
          imageSizePreview,
          imageSizePreview,
        );
        image.urlPreviewBlur = await getPlaceholderImage(image);
      }
      image.url = getImageUrl(image, imageSize, imageSize);
      image.urlBlur = await getPlaceholderImage(image);
    });
  });
  return result;
};
