import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import NextHead from "next/head";

const NewsletterConfirmation = (): JSX.Element => {
  const {
    query: { email, sha },
  } = useRouter();

  const [state, setState] = useState<"loading" | "failed" | "success">(
    "loading"
  );
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isCompleted && email != null && sha != null)
      fetch("/api/add-email-address-to-contact-list", {
        method: "POST",
        body: JSON.stringify({
          eMailAddress: email,
          sha: sha,
        }),
      })
        .then((result) => {
          if (result.status === 200) {
            setIsCompleted(true);
            setState("success");
          } else setState("failed");
        })
        .catch(() => setState("failed"));
  });

  return (
    <div className="flex flex-row justify-center items-center h-screen px-7 text-3xl text-center">
      <NextHead>
        <title>Newsletter Anmeldung - 21. Immergut Festival</title>
      </NextHead>
      {state === "loading" && "Einen Moment bitte ..."}
      {state === "success" && (
        <div>
          <p>
            Du bist dabei und erhältst ab sofort das Rundschreiben mit allen
            Neuigkeiten rund um das Immergut Festival.
          </p>
          <p>
            Bis bald!<br></br>Dein immergutrocken e.V.
          </p>
        </div>
      )}
      {state === "failed" && (
        <div>
          <p>Hoppla, da ist etwas schief gelaufen!</p>
          <p>
            Deine Anmeldung für das Immergut Festival Rundschreiben konnte NICHT
            abgeschlossen werden.
          </p>
          <p>
            Bitte kopiere den Bestätigungs-Link aus unserer E-Mail in die
            Adresszeile deines Webbrowsers. Falls deine Registrierung auch dann
            nicht abgeschlossen werden kann, melde dich bitte per E-Mail an{" "}
            <a
              href="mailto:post@immergutrocken.de"
              target="_blank"
              rel="noopener noreferrer"
            >
              post@immergutrocken.de
            </a>{" "}
            und wir schauen, wo es hakt.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterConfirmation;
