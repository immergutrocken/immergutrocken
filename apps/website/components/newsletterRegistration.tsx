import { useState } from "react";
import Button from "./shared/button";
import styles from "../styles/newsletterRegistration.module.scss";
import * as gtag from "../lib/gtag";
import { useTranslations } from "next-intl";

const NewsletterRegistration = (): JSX.Element => {
  const [eMailAddress, setEMailAddress] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [success, setSuccess] = useState(false);
  const t = useTranslations("Footer");

  const handleClick = (): void => {
    const eMailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$");
    if (eMailAddress !== "" && eMailRegex.test(eMailAddress)) {
      setIsValid(true);
      fetch(`${window.location.origin}/api/send-optin-email`, {
        method: "POST",
        body: JSON.stringify({
          eMailAddress,
          origin: window.location.origin,
        }),
      }).then(() => {
        setEMailAddress("");
        gtag.event({
          action: "newsletter_registration",
          category: "Newsletter",
          label: "",
          value: "",
        });
        setSuccess(true);
      });
    } else {
      setIsValid(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl text-center sm:text-6xl font-important">
        {t("newsletter")}
      </h2>
      <div className="flex flex-row justify-center mt-2 space-x-2">
        <input
          className={`${
            isValid ? "" : styles.invalid
          } w-56 sm:w-96 text-lg sm:text-3xl bg-secondary border-2 border-primary rounded-full px-3 sm:px-6 focus:outline-none font-important`}
          placeholder={t("your-email-address").toString()}
          value={eMailAddress}
          type="email"
          onChange={(event) => setEMailAddress(event.target.value)}
        />
        <Button click={() => handleClick()} success={success}>
          Ok
        </Button>
      </div>
    </>
  );
};

export default NewsletterRegistration;
