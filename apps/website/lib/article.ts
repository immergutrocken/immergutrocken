import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import groq from "groq";
import client from "./shared/sanityClient";
import { urlFor } from "./shared/sanityImageUrl";

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
}

export const getArticleSlugList = async (): Promise<string[]> => {
  const query = groq`*[_type == 'article']{'slug': slug.current}`;
  const result = await client.fetch(query);
  return result.map((element) => element.slug);
};

export const getArticle = async (
  slug: string,
  locale: string
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

  const result = (await client.fetch(query))[0];

  const article = {
    ...result,
    title: locale === "en" && result.titleEn ? result.titleEn : result.titleDe,
    banner: {
      ...result.banner,
      url: result.banner.hotspot
        ? urlFor(result.banner.asset)
            .height(1000)
            .width(1000)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
            .url()
        : urlFor(result.banner.asset)
            .height(1000)
            .width(1000)
            .fit("crop")
            .crop("center")
            .url(),
      urlWithBlur: result.banner.hotspot
        ? urlFor(result.banner.asset)
            .blur(200)
            .height(1000)
            .width(1000)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
            .url()
        : urlFor(result.banner.asset)
            .blur(200)
            .height(1000)
            .width(1000)
            .fit("crop")
            .crop("center")
            .url(),
    },
    content:
      locale === "en" && result.contentEn ? result.contentEn : result.contentDe,
  };

  article.content.forEach((element) => {
    if (element._type === "imageGallery") {
      element.images.forEach((image) => {
        image.urlPreview = urlFor(image.asset).height(400).url();
        image.urlPreviewBlur = urlFor(image.asset).height(400).blur(200).url();
        image.url = urlFor(image.asset).height(1000).url();
        image.urlBlur = urlFor(image.asset).height(100).blur(200).url();
      });
    }
  });

  return article;
};
