import { NextIntlProvider } from "next-intl";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <DefaultSeo
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </NextIntlProvider>
  );
}

export default MyApp;
