import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: new Date().toISOString().split("T")[0],
  useCdn: false,
});
