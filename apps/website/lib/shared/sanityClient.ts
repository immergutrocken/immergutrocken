import sanityClient from "@sanity/client";

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2021-10-21",
  useCdn: true,
});

export default client;
