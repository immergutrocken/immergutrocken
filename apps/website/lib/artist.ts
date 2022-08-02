import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import groq from "groq";
import { ArtistCategory } from "./enums/artistCategory.enum";
import { SocialMedia } from "./enums/socialMedia.enum";
import client from "./shared/sanityClient";
import { urlFor } from "./shared/sanityImageUrl";

export interface IArtistLink {
  title: string;
  slug: string;
  category: ArtistCategory;
}

export interface IArtist {
  title: string;
  banner: {
    alt: string;
    asset: SanityImageSource;
    credits: string;
    url: string;
    urlWithBlur: string;
  };
  author: string;
  socialMedia: {
    type: SocialMedia;
    url: string;
  }[];
  content: [];
}

const categoryMapping = new Map<string, ArtistCategory>([
  ["music", ArtistCategory.MUSIC],
  ["reading", ArtistCategory.READING],
]);

const socialMediaMapping = new Map<string, SocialMedia>([
  ["Website", SocialMedia.WEBSITE],
  ["YouTube", SocialMedia.YOUTUBE],
  ["Facebook", SocialMedia.FACEBOOK],
  ["Twitter", SocialMedia.TWITTER],
  ["Instagram", SocialMedia.INSTAGRAM],
  ["Vimeo", SocialMedia.VIMEO],
  ["TikTok", SocialMedia.TIKTOK],
  ["Spotify", SocialMedia.SPOTIFY],
  ["Label", SocialMedia.LABEL],
]);

export const getArtistLinkList = async (
  locale: string
): Promise<IArtistLink[]> => {
  const query = groq`
  *
  [_type == 'sortings'] {
    'titlesDe': artists[]->languages.de.title,
    'titlesEn': artists[]->languages.en.title,
    'slugs': artists[]->slug.current,
    'categories': artists[]->category
  }`;
  const result = await client.fetch(query);
  return result[0].slugs.map(
    (slug: string, index: number): IArtistLink => ({
      title:
        locale === "en" && result[0].titlesEn[index]
          ? result[0].titlesEn[index]
          : result[0].titlesDe[index],
      slug: slug,
      category: categoryMapping.get(result[0].categories[index]),
    })
  );
};

export const getArtistList = async (): Promise<{ slug: string }[]> => {
  const query = groq`*[_type == 'artist']{'slug': slug.current}`;
  return client.fetch(query);
};

export const getArtist = async (
  slug: string,
  locale: string
): Promise<IArtist> => {
  const query = groq`
  *[_type == 'artist' && slug.current == '${slug}']{
    'titleDe': languages.de.title,
    'titleEn': languages.en.title,
    'banner': languages.de.banner,
    author,
    socialMedia,
    'contentDe': languages.de.content[] {
      ..., 
      asset->{..., "_key": _id}, 
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "docType": @.reference->_type,
          "slug": @.reference->slug.current
        }
      }
    },
    'contentEn': languages.en.content[] {
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
  }`;
  const result = (await client.fetch(query))[0];
  return {
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
    socialMedia: result.socialMedia.map((element) => ({
      type: socialMediaMapping.get(element.medium),
      url: element.link.url,
    })),
    content:
      locale === "en" && result.contentEn ? result.contentEn : result.contentDe,
  };
};
