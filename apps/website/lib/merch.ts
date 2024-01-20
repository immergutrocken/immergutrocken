import groq from "groq";
import { IMerch } from "./models/merch.interface";
import client from "./shared/sanityClient";
import {
  SanityImage,
  getImageUrl,
  getPlaceholderImage,
} from "./shared/sanityImageUrl";

export const getMerch = async (locale: string): Promise<IMerch> => {
  const query = groq`*[_type == "merch"]{
      "description": languages.${locale}.description[],
      "productList": products[]{
        "title": languages.${locale}.title,
        "category": languages.${locale}.category,
        "description": languages.${locale}.description[],
        "images": images[]
      }
    }`;
  const result: IMerch = (await client.fetch(query))[0];

  if (!result) {
    return Promise.reject("No merch found");
  }

  const imageSizePreview = 300;
  const imageSize = 1000;
  result.productList?.forEach((product) => {
    product.images.forEach(async (image: SanityImage, index: number) => {
      if (index === 0) {
        image.urlPreview = getImageUrl(
          image,
          imageSizePreview,
          imageSizePreview
        );
        image.urlPreviewBlur = await getPlaceholderImage(image);
      }
      image.url = getImageUrl(image, imageSize, imageSize);
      image.urlBlur = await getPlaceholderImage(image);
    });
  });
  return result;
};
