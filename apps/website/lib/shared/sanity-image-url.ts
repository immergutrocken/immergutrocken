import { getPlaiceholder } from "plaiceholder";

import imageUrlBuilder from "@sanity/image-url";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { getSanityClient } from "./sanity-client";

export interface SanityImage {
  hotspot: {
    x: number;
    y: number;
  };
  asset: SanityImageSource;
  urlPreview: string;
  urlPreviewBlur: string;
  url: string;
  urlBlur: string;
  alt: string;
  credits: string;
}

const builder = imageUrlBuilder(getSanityClient());

const urlFor = (source: SanityImageSource): ImageUrlBuilder => {
  return builder.image(source);
};

export const getImageUrl = (
  { hotspot, asset }: SanityImage,
  height: number | null = null,
  width: number | null = null,
): string =>
  hotspot
    ? getUrlFor(asset, height, width)
        .fit("crop")
        .crop("focalpoint")
        .focalPoint(hotspot.x, hotspot.y)
        .url()
    : getUrlFor(asset, height, width).fit("crop").crop("center").url();

const getUrlFor = (
  asset: SanityImageSource,
  height: number | null,
  width: number | null,
): ImageUrlBuilder => {
  let result = urlFor(asset);

  if (height) result = result.height(height);
  if (width) result = result.width(width);

  return result;
};

export const getPlaceholderImage = ({
  hotspot,
  asset,
}: SanityImage): Promise<string> =>
  getBase64Image(
    hotspot
      ? urlFor(asset)
          .height(10)
          .fit("crop")
          .crop("focalpoint")
          .focalPoint(hotspot.x, hotspot.y)
          .url()
      : urlFor(asset).height(10).width(10).fit("crop").crop("center").url(),
  );

const getBase64Image = async (src: string): Promise<string> => {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { ...plaiceholder } = await getPlaiceholder(buffer, { size: 10 });

  return plaiceholder.base64;
};
