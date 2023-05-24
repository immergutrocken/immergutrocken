import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import groq from "groq";
import client from "./shared/sanityClient";
import { urlFor } from "./shared/sanityImageUrl";

export interface IGeneralSettings {
  websiteTitle: string;
  bannerDesktop: {
    alt: string;
    asset: SanityImageSource;
    credits: string;
    url: string;
    urlWithBlur: string;
    width: number;
    height: number;
  };
  bannerMobile: {
    alt: string;
    asset: SanityImageSource;
    credits: string;
    url: string;
    urlWithBlur: string;
    width: number;
    height: number;
  };
  showNewsAsPrimaryContent: boolean;
  additionalTextAfterArtists: string;
  isPerformanceDetailsVisible: boolean;
}

export const getGeneralSettings = async (
  locale: string
): Promise<IGeneralSettings> => {
  const query = groq`*[_type == 'generalSettings'] {
    'websiteTitleDe': languages.de.websiteTitle,
    'websiteTitleEn': languages.en.websiteTitle,
    'bannerDesktopDe': languages.de.bannerDesktop,
    'bannerDesktopEn': languages.en.bannerDesktop,
    'bannerMobileDe': languages.de.bannerMobile,
    'bannerMobileEn': languages.en.bannerMobile,
    'displayMode': displayMode,
    'additionalTextAfterArtistsDe': languages.de.additionalTextAfterArtists,
    'additionalTextAfterArtistsEn': languages.en.additionalTextAfterArtists,
    'isPerformanceDetailsVisible': isPerformanceDetailsVisible
  }`;
  const result = (await client.fetch(query))[0];
  const bannerDesktop =
    locale === "de"
      ? result.bannerDesktopDe
      : result.bannerDesktopEn ?? result.bannerDesktopDe;
  const bannerMobile =
    locale === "de"
      ? result.bannerMobileDe
      : result.bannerMobileEn ?? result.bannerMobileDe;
  return {
    websiteTitle:
      locale === "de"
        ? result.websiteTitleDe
        : result.websiteTitleEn ?? result.websiteTitleDe,
    bannerDesktop: {
      ...bannerDesktop,
      url: bannerDesktop.hotspot
        ? urlFor(bannerDesktop.asset)
          .fit("crop")
          .crop("focalpoint")
          .focalPoint(bannerDesktop.hotspot.x, bannerDesktop.hotspot.y)
          .url()
        : urlFor(bannerDesktop.asset).url(),
      urlWithBlur: bannerDesktop.hotspot
        ? urlFor(bannerDesktop.asset)
          .fit("crop")
          .crop("focalpoint")
          .focalPoint(bannerDesktop.hotspot.x, bannerDesktop.hotspot.y)
          .blur(200)
          .url()
        : urlFor(bannerDesktop.asset).blur(200).url(),
    },
    bannerMobile: {
      ...bannerMobile,
      url: bannerMobile.hotspot
        ? urlFor(bannerMobile.asset)
          .fit("crop")
          .crop("focalpoint")
          .focalPoint(bannerMobile.hotspot.x, bannerMobile.hotspot.y)
          .url()
        : urlFor(bannerMobile.asset).url(),
      urlWithBlur: bannerMobile.hotspot
        ? urlFor(bannerMobile.asset)
          .fit("crop")
          .crop("focalpoint")
          .focalPoint(bannerMobile.hotspot.x, bannerMobile.hotspot.y)
          .blur(200)
          .url()
        : urlFor(bannerMobile.asset).blur(200).url(),
    },
    showNewsAsPrimaryContent: result.displayMode
      ? result.displayMode === "news"
      : true,
    additionalTextAfterArtists:
      locale === "de"
        ? result.additionalTextAfterArtistsDe
        : result.additionalTextAfterArtistsEn ??
        result.additionalTextAfterArtistsDe,
    isPerformanceDetailsVisible: result.isPerformanceDetailsVisible ?? false,
  };
};
