import { createClient } from "@sanity/client";

// Mock the @sanity/client module
jest.mock("@sanity/client", () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe("sanityClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should create a client with test environment configuration", () => {
    // Mock the createClient to return a basic client object
    const mockClient = {
      fetch: jest.fn(),
      listen: jest.fn(),
      config: jest.fn(),
    };
    mockCreateClient.mockReturnValue(mockClient as any);

    // Import the module to trigger initialization
    const { sanityClient } = require("../../../lib/shared/sanity-client");

    expect(mockCreateClient).toHaveBeenCalledTimes(1);
    expect(mockCreateClient).toHaveBeenCalledWith({
      projectId: "test",
      dataset: "test",
      apiVersion: expect.any(String),
      useCdn: false,
    });

    expect(sanityClient).toBe(mockClient);
  });

  it("should use current date as apiVersion in YYYY-MM-DD format", () => {
    const mockClient = { fetch: jest.fn() };
    mockCreateClient.mockReturnValue(mockClient as any);

    // Import the module
    require("../../../lib/shared/sanity-client");

    const calledWith = mockCreateClient.mock.calls[0][0];
    const apiVersion = calledWith.apiVersion;
    
    // Check that apiVersion matches YYYY-MM-DD format
    expect(apiVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    // Check that it's today's date
    const today = new Date().toISOString().split("T")[0];
    expect(apiVersion).toBe(today);
  });

  it("should set useCdn to false", () => {
    const mockClient = { fetch: jest.fn() };
    mockCreateClient.mockReturnValue(mockClient as any);

    require("../../../lib/shared/sanity-client");

    const calledWith = mockCreateClient.mock.calls[0][0];
    expect(calledWith.useCdn).toBe(false);
  });

  it("should use project ID from environment", () => {
    const mockClient = { fetch: jest.fn() };
    mockCreateClient.mockReturnValue(mockClient as any);

    require("../../../lib/shared/sanity-client");

    const calledWith = mockCreateClient.mock.calls[0][0];
    expect(calledWith.projectId).toBe("test");
  });

  it("should use dataset from environment", () => {
    const mockClient = { fetch: jest.fn() };
    mockCreateClient.mockReturnValue(mockClient as any);

    require("../../../lib/shared/sanity-client");

    const calledWith = mockCreateClient.mock.calls[0][0];
    expect(calledWith.dataset).toBe("test");
  });

  it("should export the created client", () => {
    const mockClient = { fetch: jest.fn(), config: jest.fn() };
    mockCreateClient.mockReturnValue(mockClient as any);

    const { sanityClient } = require("../../../lib/shared/sanity-client");

    expect(sanityClient).toBeDefined();
    expect(sanityClient).toBe(mockClient);
    expect(typeof sanityClient.fetch).toBe("function");
  });
});