import sha256 from "crypto-js/sha256";
import { NextApiRequest, NextApiResponse } from "next";
import { Contact, ContactSubscription, LibraryResponse } from "node-mailjet";

import { mailjetClient } from "../../lib/shared/mailjetClient";

const addEmailAddressToContactList = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { eMailAddress, sha } = JSON.parse(req.body);
  const fixedEmail = eMailAddress.replace(" ", "+");

  if (sha256(fixedEmail).toString() === sha) {
    const listId = Number.parseInt(process.env.MAILJET_LIST_ID ?? "");
    const contactResponse: LibraryResponse<Contact.GetContactResponse> =
      await mailjetClient
        .get("contact", { version: "v3" })
        .id(fixedEmail)
        .request();

    const contact = contactResponse.body.Data.find(
      (data) => data.Email === fixedEmail,
    );

    const listRecipientResponse: LibraryResponse<ContactSubscription.GetListRecipientResponse> =
      await mailjetClient.get("listrecipient").request({
        Contact: contact?.ID,
      });

    const listRecipient = listRecipientResponse.body.Data.find(
      (data) => data.ListID === listId,
    );

    if (listRecipient && contact?.ID === listRecipient.ContactID) {
      if (listRecipient.IsUnsubscribed) {
        res.status(200).json("");
        return;
      }

      mailjetClient
        .put("listrecipient")
        .id(listRecipient.ID)
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
      mailjetClient
        .post("listrecipient")
        .request({
          ContactID: contact?.ID,
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
