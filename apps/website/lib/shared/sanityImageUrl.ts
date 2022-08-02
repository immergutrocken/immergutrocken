import imageUrlBuilder from "@sanity/image-url";
import client from "./sanityClient";
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource): ImageUrlBuilder => {
  return builder.image(source);
};
