import { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import client from "../../lib/shared/mailjetClient";

interface IBody {
  origin: string;
  eMailAddress: string;
}

const sendOptinEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const body = JSON.parse(req.body) as IBody;
  const link = `${body.origin}/newsletter-confirmation?email=${
    body.eMailAddress
  }&sha=${sha256(body.eMailAddress)}`;

  const request = client.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "no-reply@immergutrocken.de",
        },
        To: [
          {
            Email: body.eMailAddress,
          },
        ],
        Subject: "Immergut - Newsletter Anmeldung",
        TextPart: `Vielen Dank für deine Anmeldung.
          Noch ein Klick und deine Anmeldung zum Immergut Festival Rundschreiben ist abgeschlossen: ${link}`,
        HTMLPart: `<!DOCTYPE html>
          <html>
          <head><meta charset="utf-8" /></head>
          <body>
          <p>
          Vielen Dank für deine Anmeldung.<br>
          Noch ein Klick und deine Anmeldung zum Immergut Festival Rundschreiben ist abgeschlossen:
          </p>
          <p><a href="${link}">Anmeldung bestätigen</a></p>
          <p>Wenn der Bestätigungs-Button nicht funktioniert, klicke mit rechter Maustaste auf den Button und kopiere den Link in die Adresszeile deines Browsers.</p>
          <p>Solltest du dich nicht für das Rundschreiben angemeldet haben, ignoriere diese E-Mail bitte einfach.</p>
          <p>Bis bald!<br>Dein immergutrocken e.V.</p>
          </body>
          </html>`,
      },
    ],
  });

  await request
    .then(() => {
      res.status(200).json({});
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

export default sendOptinEmail;
