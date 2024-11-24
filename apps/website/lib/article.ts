import groq from "groq";

import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityClient } from "./shared/sanityClient";
import {
  getImageUrl,
  getPlaceholderImage,
  SanityImage,
} from "./shared/sanityImageUrl";

export interface IArticle {
  title: string;
  banner: {
    alt: string;
    asset: SanityImageSource;
    credits: string;
    url: string;
    urlWithBlur: string;
  };
  author: string;
  ogDescription: string;
  content: [];
  slug: string;
}

export const getArticleSlugList = async (): Promise<string[]> => {
  const query = groq`*[_type == 'article']{'slug': slug.current}`;
  const result = await sanityClient.fetch(query);
  return result.map((element: IArticle) => element.slug);
};

export const getArticle = async (
  slug: string,
  locale: string,
): Promise<IArticle> => {
  const query = groq`
  *
  [_type == "article" && slug.current == "${slug}"]
  {
    "titleDe": languages.de.title,
    "titleEn": languages.en.title,
    "banner": languages.de.banner,
    author,
    ogDescription,
    "contentDe": languages.de.content[] {
      ..., 
      asset->{..., "_key": _id}, 
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "docType": @.reference->_type,
          "slug": @.reference->slug.current
        }
      },
      _type == "expander" => {
        ...,
        content[] {
          ...,
          asset->{..., "_key": _id},
          markDefs[]{
            ...,
            _type == "internalLink" => {
              "docType": @.reference->_type,
              "slug": @.reference->slug.current
            }
          }
        }
      }
    },
    "contentEn": languages.en.content[] {
      ..., 
      asset->{
        ..., "_key": _id
      }, 
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "docType": @.reference->_type,
          "slug": @.reference->slug.current
        },
      },
      _type == "expander" => {
        ...,
        content[] {
          ...,
          asset->{..., "_key": _id},
          markDefs[]{
            ...,
            _type == "internalLink" => {
              "docType": @.reference->_type,
              "slug": @.reference->slug.current
            }
          }
        }
      }
    }
  }`;

  const result = (await sanityClient.fetch(query))[0];

  const article = {
    ...result,
    title: locale === "en" && result.titleEn ? result.titleEn : result.titleDe,
    banner: {
      ...result.banner,
      url: getImageUrl(result.banner, 1000, 1000),
      urlWithBlur: await getPlaceholderImage(result.banner),
    },
    content:
      locale === "en" && result.contentEn ? result.contentEn : result.contentDe,
  };

  article.content.forEach(
    (element: { _type: string; images: SanityImage[] }) => {
      if (element._type === "imageGallery") {
        element.images.forEach(async (image: SanityImage) => {
          image.urlPreview = getImageUrl(image, 400);
          image.urlPreviewBlur = await getPlaceholderImage(image);
          image.url = getImageUrl(image, 1000);
          image.urlBlur = await getPlaceholderImage(image);
        });
      }
    },
  );

  return article;
};
