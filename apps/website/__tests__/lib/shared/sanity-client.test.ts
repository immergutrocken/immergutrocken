import { createClient } from "@sanity/client";
import {
  getSanityClient,
  resetSanityClient,
} from "../../../lib/shared/sanity-client";

describe("createSanityClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetSanityClient();
    process.env.SANITY_STUDIO_PROJECT_ID = "test";
    process.env.SANITY_STUDIO_DATASET = "test";
  });

  it("should create a client", () => {
    expect(getSanityClient()).toBeDefined();
  });

  it("should call createClient with correct parameters", () => {
    getSanityClient();
    expect(createClient).toHaveBeenCalledWith({
      projectId: "test",
      dataset: "test",
      apiVersion: expect.any(String),
      useCdn: false,
    });
  });
});
