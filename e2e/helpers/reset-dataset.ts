import { createClient } from "@sanity/client";

/**
 * Helper to reset the E2E Sanity dataset before tests
 * This ensures each test run starts with a clean slate
 */
export async function resetE2EDataset() {
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "05hvmwlk",
    dataset: process.env.SANITY_DATASET_E2E ?? "e2e-test",
    apiVersion: new Date().toISOString().split("T")[0],
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  // Delete all documents in the E2E dataset
  try {
    const query = '*[_type in ["artist", "article", "partner", "menu"]]';
    const documents = await client.fetch(query);

    if (documents && documents.length > 0) {
      const transaction = client.transaction();
      documents.forEach((doc: { _id: string }) => {
        transaction.delete(doc._id);
      });
      await transaction.commit();
      console.log(`Deleted ${documents.length} documents from E2E dataset`);
    } else {
      console.log("E2E dataset is already empty");
    }
  } catch (error) {
    console.error("Error resetting E2E dataset:", error);
    throw error;
  }
}
