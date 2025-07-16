import "@testing-library/jest-dom";

export const sanityClientFetchMock = jest.fn();

jest.mock("@sanity/client", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    fetch: sanityClientFetchMock,
  })),
}));

jest.mock("./lib/shared/sanity-image-url", () => ({
  getImageUrl: jest.fn((_image, width) => `mock-image-url-${width}`),
  getPlaceholderImage: jest.fn().mockResolvedValue("mock-placeholder-url"),
}));
