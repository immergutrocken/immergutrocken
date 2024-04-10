import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { IGeneralSettings } from '../lib/general-settings';
import socialMedia from '../lib/models/socialMedia';
import { IPartner } from '../lib/partner';
import NewsletterRegistration from './newsletterRegistration';
import Partner from './partner';
import Bubble from './shared/bubble';
import Link from './shared/link';

interface FooterProps {
  sponsorList: IPartner[];
  mediaPartnerList: IPartner[];
  additionalList: IPartner[];
  generalSettings: IGeneralSettings;
}

const Footer = ({
  sponsorList,
  mediaPartnerList,
  additionalList,
  generalSettings,
}: FooterProps): JSX.Element => {
  const t = useTranslations("Footer");
  const router = useRouter();

  const startDate = new Date(generalSettings.countdown.festivalStartDate);
  const endDate = new Date(generalSettings.countdown.festivalEndDate);
  const difference = startDate.getTime() - new Date().getTime();
  let days = Math.ceil(difference / (1000 * 3600 * 24));
  days = days < 0 ? 0 : days;
  const startAndEndDateString = `${startDate.toLocaleDateString(router.locale, {day: "numeric", month: "numeric"})} - ${endDate.toLocaleDateString(router.locale)}`;

  return (
    <>
      <div className="mt-8 sm:mt-12">
        <NewsletterRegistration />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        {socialMedia.map((element, index) => (
          <Link href={element.url} key={index} className="hover:no-underline">
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
      <div className="w-full max-w-3xl px-3 pb-12 mx-auto mt-8 text-center sm:pb-20 font-content">
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
      {generalSettings.countdown.showCountdown && <div className="fixed bottom-0 flex justify-center w-full py-1 text-lg border-t-2 sm:text-4xl bg-secondary border-primary font-important">
        {startAndEndDateString} ... noch {days} Tag{days !== 1 ? "e" : ""}!
      </div>}
    </>
  );
};

export default Footer;
