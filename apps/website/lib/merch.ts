import groq from "groq";
import { IMerch } from "./models/merch.interface";
import client from "./shared/sanityClient";
import { urlFor } from "./shared/sanityImageUrl";

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

  const imageSizePreview = 300;
  const imageSize = 1000;
  result.productList.forEach((product) => {
    product.images.forEach((image, index) => {
      if (index === 0) {
        image.urlPreview = image.hotspot
          ? urlFor(image.asset)
              .width(imageSizePreview)
              .height(imageSizePreview)
              .fit("crop")
              .crop("focalpoint")
              .focalPoint(image.hotspot.x, image.hotspot.y)
              .url()
          : urlFor(image.asset)
              .width(imageSizePreview)
              .height(imageSizePreview)
              .fit("crop")
              .crop("center")
              .url();
        image.urlPreviewBlur = image.hotspot
          ? urlFor(image.asset)
              .width(imageSizePreview)
              .height(imageSizePreview)
              .fit("crop")
              .crop("focalpoint")
              .focalPoint(image.hotspot.x, image.hotspot.y)
              .blur(200)
              .url()
          : urlFor(image.asset)
              .width(imageSizePreview)
              .height(imageSizePreview)
              .fit("crop")
              .crop("center")
              .blur(200)
              .url();
      }
      image.url = image.hotspot
        ? urlFor(image.asset)
            .width(imageSize)
            .height(imageSize)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(image.hotspot.x, image.hotspot.y)
            .url()
        : urlFor(image.asset)
            .width(imageSize)
            .height(imageSize)
            .fit("crop")
            .crop("center")
            .url();
      image.urlBlur = image.hotspot
        ? urlFor(image.asset)
            .width(imageSize)
            .height(imageSize)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(image.hotspot.x, image.hotspot.y)
            .blur(200)
            .url()
        : urlFor(image.asset)
            .width(imageSize)
            .height(imageSize)
            .fit("crop")
            .crop("center")
            .blur(200)
            .url();
    });
  });
  return result;
};
