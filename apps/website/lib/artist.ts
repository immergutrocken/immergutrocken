import groq from "groq";

import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ArtistCategory } from "./enums/artistCategory.enum";
import { SocialMedia } from "./enums/socialMedia.enum";
import { sanityClient } from "./shared/sanity-client";
import {
  getImageUrl,
  getPlaceholderImage,
  SanityImage,
} from "./shared/sanity-image-url";

export interface IArtistLink {
  title: string;
  slug: string;
  category: ArtistCategory | undefined;
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
  performance: {
    stage: string;
    time: string;
  };
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
  locale: string,
): Promise<IArtistLink[]> => {
  const query = groq`
  *
  [_type == 'sortings'] {
    'titlesDe': artists[]->languages.de.title,
    'titlesEn': artists[]->languages.en.title,
    'slugs': artists[]->slug.current,
    'categories': artists[]->category
  }`;
  const result = await sanityClient.fetch(query);
  return (
    result[0].slugs?.map(
      (slug: string, index: number): IArtistLink => ({
        title:
          locale === "en" && result[0].titlesEn[index]
            ? result[0].titlesEn[index]
            : result[0].titlesDe[index],
        slug: slug,
        category: categoryMapping.get(result[0].categories[index]),
      }),
    ) ?? []
  );
};

export const getArtistList = async (): Promise<{ slug: string }[]> => {
  const query = groq`*[_type == 'artist']{'slug': slug.current}`;
  return sanityClient.fetch(query);
};

export const getArtist = async (
  slug: string,
  locale: string,
): Promise<IArtist> => {
  const query = groq`
  *[_type == 'artist' && slug.current == '${slug}']{
    'titleDe': languages.de.title,
    'titleEn': languages.en.title,
    'banner': languages.de.banner,
    author,
    performance,
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
  const result = (await sanityClient.fetch(query))[0];

  const artist: IArtist = {
    ...result,
    title: locale === "en" && result.titleEn ? result.titleEn : result.titleDe,
    banner: {
      ...result.banner,
      url: getImageUrl(result.banner, 1000, 1000),
      urlWithBlur: await getPlaceholderImage(result.banner),
    },
    socialMedia:
      result.socialMedia?.map(
        (element: { medium: string; link: { url: string } }) => ({
          type: socialMediaMapping.get(element.medium),
          url: element.link.url,
        }),
      ) ?? [],
    content:
      locale === "en" && result.contentEn ? result.contentEn : result.contentDe,
  };

  artist.content.forEach(
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

  return artist;
};
