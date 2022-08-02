import { IPartner } from "../lib/partner";
import Bubble from "./shared/bubble";
import Link from "./shared/link";
import Partner from "./partner";
import socialMedia from "../lib/models/socialMedia";
import NewsletterRegistration from "./newsletterRegistration";
import { useTranslations } from "next-intl";

interface FooterProps {
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
}

const Footer = ({
  sponsorList,
  mediaPartnerList,
  additionalList,
}: FooterProps): JSX.Element => {
  const t = useTranslations("Footer");

  return (
    <>
      <div className="mt-8 sm:mt-12">
        <NewsletterRegistration />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        {socialMedia.map((element, index) => (
          <Link href={element.url} key={index}>
            <Bubble>
              <em className={`fab fa-${element.brandLogo}`}></em>
            </Bubble>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 px-3 mt-10 lg:grid-cols-3 sm:gap-6">
        <Partner label={t("sponsors").toString()} list={sponsorList} />
        <Partner
          label={t("media-partners").toString()}
          list={mediaPartnerList}
        />
        <Partner label={t("supported-by").toString()} list={additionalList} />
      </div>
      <div className="w-full max-w-3xl px-3 pb-6 mx-auto mt-8 text-center sm:pb-10 font-content">
        <p>
          Immergut Festival / Am Bürgerseeweg 28 / 17235 Neustrelitz
          <br />
          {t("disclaimer").toString()}
        </p>
        <p className="mt-4">
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>
          , structured content powered by{" "}
          <Link href="https://www.sanity.io">sanity.io</Link>, hosted by{" "}
          <Link href="https://www.vercel.com?utm_source=website-2021&utm_campaign=oss">
            vercel.com
          </Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
