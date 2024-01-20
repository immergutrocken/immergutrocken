import { SanityImage } from "../shared/sanityImageUrl";

export interface IProduct {
  title: string;
  category: string;
  description: [];
  images: SanityImage[];
}
