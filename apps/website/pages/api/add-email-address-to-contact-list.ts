import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/shared/mailjetClient";
import sha256 from "crypto-js/sha256";
import { ContactSubscription, LibraryResponse } from "node-mailjet";

const addEmailAddressToContactList = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { eMailAddress, sha } = JSON.parse(req.body);
  const fixedEmail = eMailAddress.replace(" ", "+");

  if (sha256(fixedEmail).toString() === sha) {
    const listRecipientResponse: LibraryResponse<ContactSubscription.GetListRecipientResponse> =
      await client.get("listrecipient").request({
        ContactEmail: fixedEmail,
      });

    if (listRecipientResponse.body.Data.length !== 0) {
      const data = listRecipientResponse.body.Data[0];

      if (!data.IsUnsubscribed) {
        res.status(200).json({});
        return;
      }

      client
        .put("listrecipient")
        .id(data.ID)
        .request({
          IsUnsubscribed: false,
        })
        .then(() => {
          res.status(200).json({});
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json(error);
        });
    } else {
      client
        .post("listrecipient")
        .request({
          ContactAlt: fixedEmail,
          ListID: process.env.MAILJET_LIST_ID,
        })
        .then(() => {
          res.status(200).json({});
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json(error);
        });
    }
  } else {
    res.status(403).json({
      message: "E-Mail address is not valid",
    });
  }
};

export default addEmailAddressToContactList;
