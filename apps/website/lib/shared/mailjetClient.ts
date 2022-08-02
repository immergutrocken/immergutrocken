import mailjet from "node-mailjet";

const client = mailjet.connect(
  process.env.MAILJET_PUBLIC_API_KEY,
  process.env.MAILJET_PRIVATE_API_KEY
);

export default client;
