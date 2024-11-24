import { SanityImage } from "../shared/sanity-image-url";

export interface IProduct {
  title: string;
  category: string;
  description: [];
  images: SanityImage[];
}
