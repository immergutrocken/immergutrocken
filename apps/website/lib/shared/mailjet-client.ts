import Mailjet from "node-mailjet";

export const mailjetClient = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC_API_KEY,
  apiSecret: process.env.MAILJET_PRIVATE_API_KEY,
});
