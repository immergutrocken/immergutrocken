import "../styles/globals.scss";

import { NextIntlClientProvider } from "next-intl";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      messages={pageProps.messages}
      timeZone="Europe/Berlin"
      locale={router.locale}
    >
      <DefaultSeo
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
  );
}

export default MyApp;
