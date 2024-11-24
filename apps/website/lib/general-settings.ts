import groq from "groq";

import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityClient } from "./shared/sanityClient";
import { getImageUrl, getPlaceholderImage } from "./shared/sanityImageUrl";

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
  ticketshopUrl: string;
  countdown: {
    showCountdown: boolean;
    festivalStartDate: string;
    festivalEndDate: string;
  };
}

export const getGeneralSettings = async (
  locale: string,
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
    'isPerformanceDetailsVisible': isPerformanceDetailsVisible,
    'ticketshopUrl': ticketshopUrl,
    'countdown': countdown
  }`;
  const result = (await sanityClient.fetch(query))[0];
  const bannerDesktop =
    locale === "de"
      ? result.bannerDesktopDe
      : (result.bannerDesktopEn ?? result.bannerDesktopDe);
  const bannerMobile =
    locale === "de"
      ? result.bannerMobileDe
      : (result.bannerMobileEn ?? result.bannerMobileDe);
  return {
    ...result,
    websiteTitle:
      locale === "de"
        ? result.websiteTitleDe
        : (result.websiteTitleEn ?? result.websiteTitleDe),
    bannerDesktop: {
      ...bannerDesktop,
      url: getImageUrl(bannerDesktop),
      urlWithBlur: await getPlaceholderImage(bannerDesktop),
    },
    bannerMobile: {
      ...bannerMobile,
      url: getImageUrl(bannerMobile),
      urlWithBlur: await getPlaceholderImage(bannerMobile),
    },
    showNewsAsPrimaryContent: result.displayMode
      ? result.displayMode === "news"
      : true,
    additionalTextAfterArtists:
      locale === "de"
        ? result.additionalTextAfterArtistsDe
        : (result.additionalTextAfterArtistsEn ??
          result.additionalTextAfterArtistsDe),
    isPerformanceDetailsVisible: result.isPerformanceDetailsVisible ?? false,
  };
};
