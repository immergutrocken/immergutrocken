import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: new Date().toISOString().split("T")[0],
  useCdn: false,
});

export default client;
