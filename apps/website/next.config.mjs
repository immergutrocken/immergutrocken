import withPlaiceholder from "@plaiceholder/next";

const config = {
  images: {
    domains: ["cdn.sanity.io"],
    dangerouslyAllowSVG: true,
  },
  i18n: {
    locales: ["de", "en"],
    defaultLocale: "de",
  },
};

export default withPlaiceholder(config);
