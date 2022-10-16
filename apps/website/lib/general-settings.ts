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
}

//testtttt
export const getGeneralSettings = async (
  locale: string
): Promise<IGeneralSettings> => {
  const query = groq`*[_type == 'generalSettings'] {
    'websiteTitleDe': languages.de.websiteTitle,
    'websiteTitleEn': languages.en.websiteTitle,
    'bannerDesktopDe': languages.de.bannerDesktop,
    'bannerDesktopEn': languages.en.bannerDesktop,
    'bannerMobileDe': languages.de.bannerMobile,
    'bannerMobileEn': languages.en.bannerMobile
  }`;
  const result = (await client.fetch(query))[0];
  const bannerDesktop =
    locale === "de" ? result.bannerDesktopDe : result.bannerDesktopEn;
  const bannerMobile =
    locale === "de" ? result.bannerMobileDe : result.bannerMobileEn;
  return {
    websiteTitle:
      locale === "de" ? result.websiteTitleDe : result.websiteTitleEn,
    bannerDesktop: {
      ...bannerDesktop,
      url: bannerDesktop.hotspot
        ? urlFor(bannerDesktop.asset)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
            .url()
        : urlFor(bannerDesktop.asset).url(),
      urlWithBlur: bannerDesktop.hotspot
        ? urlFor(bannerDesktop.asset)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
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
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
            .url()
        : urlFor(bannerMobile.asset).url(),
      urlWithBlur: bannerMobile.hotspot
        ? urlFor(bannerMobile.asset)
            .fit("crop")
            .crop("focalpoint")
            .focalPoint(result.banner.hotspot.x, result.banner.hotspot.y)
            .blur(200)
            .url()
        : urlFor(bannerMobile.asset).blur(200).url(),
    },
  };
};
