import { createClient, SanityClient } from "@sanity/client";

let sanityClient: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  sanityClient ??= createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
    apiVersion: new Date().toISOString().split("T")[0],
    useCdn: false,
  });

  return sanityClient;
}

export function resetSanityClient(): void {
  sanityClient = null;
}
