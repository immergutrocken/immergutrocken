import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "05hvmwlk",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "immergutrocken",
  apiVersion: new Date().toISOString().split("T")[0],
  useCdn: false,
});
