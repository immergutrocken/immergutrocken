import { IPartner } from "../lib/partner";
import Bubble from "./shared/bubble";
import Link from "./shared/link";
import Partner from "./partner";
import socialMedia from "../lib/models/socialMedia";
import NewsletterRegistration from "./newsletterRegistration";
import { useTranslations } from "next-intl";
import IgFernglasSvg from "./motto/ig-fernglas-svg";

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
      <div className="flex justify-center py-16 sm:py-24 bg-ciPurple">
        <div className="relative">
          <div className="absolute flex justify-center w-2/3 pr-2 sm:pr-8 -left-2/3 -top-2/3 -bottom-2/3">
            <IgFernglasSvg />
          </div>
          <NewsletterRegistration />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-8 pb-8 bg-ciGray">
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
      <div className="w-full px-3 pt-8 pb-6 text-center sm:pb-10 font-content bg-ciOrange">
        <div className="max-w-3xl mx-auto">
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
      </div>
    </>
  );
};

export default Footer;
