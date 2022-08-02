import { NextApiRequest, NextApiResponse } from "next";
import client from "../../lib/shared/mailjetClient";
import sha256 from "crypto-js/sha256";

interface IData {
  ID: string | number;
  IsUnsubscribed: boolean;
}

const addEmailAddressToContactList = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { eMailAddress, sha } = JSON.parse(req.body);
  const fixedEmail = eMailAddress.replace(" ", "+");

  if (sha256(fixedEmail).toString() === sha) {
    const listRecipient = await client.get("listrecipient").request({
      ContactEmail: fixedEmail,
    });

    if (listRecipient.body.Count !== 0) {
      const data = listRecipient.body.Data[0] as IData;

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
