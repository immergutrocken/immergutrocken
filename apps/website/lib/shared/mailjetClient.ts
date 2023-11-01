import Mailjet from "node-mailjet";

const client = new Mailjet({
  apiKey: process.env.MAILJET_PUBLIC_API_KEY,
  apiSecret: process.env.MAILJET_PRIVATE_API_KEY,
});

export default client;
