import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

import styles from "../styles/newsletterRegistration.module.scss";
import Button from "./shared/button";

const NewsletterRegistration = (): ReactNode => {
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
        setSuccess(true);
      });
    } else {
      setIsValid(false);
    }
  };

  return (
    <>
      <h2 className="text-center font-important text-3xl sm:text-6xl">
        {t("newsletter")}
      </h2>
      <div className="mt-2 flex flex-row justify-center space-x-2">
        <input
          className={`${
            isValid ? "" : styles.invalid
          } w-56 rounded-full border-2 border-primary bg-secondary px-3 font-important text-lg focus:outline-none sm:w-96 sm:px-6 sm:text-3xl`}
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
