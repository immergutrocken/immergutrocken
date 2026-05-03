import { createClient } from "@sanity/client";

export async function resetE2EDataset() {
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "05hvmwlk",
    dataset: process.env.SANITY_DATASET_E2E ?? "e2e-test",
    apiVersion: new Date().toISOString().split("T")[0],
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  const documents = await client.fetch("*");
  if (!documents.length) {
    console.log("E2E dataset is already empty");
    return;
  }

  const transaction = client.transaction();
  documents.forEach((doc: { _id: string }) => transaction.delete(doc._id));
  await transaction.commit();
  console.log(`Deleted ${documents.length} documents from E2E dataset`);
}
