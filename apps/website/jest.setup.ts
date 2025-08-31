import "@testing-library/jest-dom";
/**
 * Utility functions and mocks for testing in the website application.
 * This file provides common setup for Jest tests, including mocks for Sanity client,
 * image URL builders, and placeholder image generation.
 *
 * @module test-utils
 *
 * @example
 * // In your Jest test setup file or test:
 * import { sanityClientFetchMock, mockImageUrlBuilder } from './test-utils';
 *
 * jest.mock('@sanity/client', () => ({
 *   createClient: jest.fn().mockImplementation(() => ({
 *     fetch: sanityClientFetchMock,
 *   })),
 * }));
 */
export const sanityClientFetchMock = jest.fn();
jest.mock("@sanity/client", () => ({
  createClient: jest.fn().mockImplementation(() => ({
    fetch: sanityClientFetchMock,
  })),
}));

/**
 * A mock implementation of an image URL builder, typically used for testing components
 * that depend on chained image transformation methods (e.g., Sanity's image-url builder).
 * Each method is a Jest mock function that returns the mock object itself, allowing for method chaining.
 * The `url` method returns a fixed mock URL string.
 *
 * @example
 * // In your Jest test setup file or test:
 * import { mockImageUrlBuilder } from './test-utils';
 *
 * jest.mock('@sanity/image-url', () => ({
 *   urlFor: () => mockImageUrlBuilder,
 * }));
 *
 * // Now, when your code calls urlFor().width(100).url(), it will return "mock-sanity-image-url"
 */
export const mockImageUrlBuilder = {
  image: jest.fn().mockReturnThis(),
  height: jest.fn().mockReturnThis(),
  width: jest.fn().mockReturnThis(),
  fit: jest.fn().mockReturnThis(),
  crop: jest.fn().mockReturnThis(),
  focalPoint: jest.fn().mockReturnThis(),
  url: jest.fn().mockReturnValue("mock-sanity-image-url"),
};
jest.mock("@sanity/image-url", () => () => mockImageUrlBuilder);

/**
 * A mock implementation of the getPlaiceholder function from the plaiceholder package.
 * This mock returns a resolved promise with a base64 placeholder image string.
 *
 * @example
 * // In your Jest test setup file or test:
 * import { mockGetPlaiceholder } from './test-utils';
 *
 * jest.mock('plaiceholder', () => ({
 *   getPlaiceholder: mockGetPlaiceholder,
 * }));
 */
export const mockGetPlaiceholder = jest.fn().mockResolvedValue({
  base64: "mock-base64-placeholder",
});
jest.mock("plaiceholder", () => ({
  getPlaiceholder: mockGetPlaiceholder,
}));

/**
 * A mock implementation of the global fetch function.
 * This mock returns a resolved promise with an ArrayBuffer, simulating a network request.
 *
 * @example
 * // In your Jest test setup file or test:
 * import { mockFetch } from './test-utils';
 *
 * global.fetch = mockFetch;
 */
export const mockFetch = jest.fn().mockResolvedValue({
  arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
});
global.fetch = mockFetch;

type SanityImageUrlMocks = {
  getImageUrl: jest.Mock;
  getPlaceholderImage: jest.Mock;
};

/**
 * Mocks the Sanity image URL functions for testing.
 *
 * @param overrides - Optional overrides for the default mock implementations.
 * @returns An object containing the mocked Sanity image URL functions.
 *
 * @example
 * // In your Jest test setup file or test:
 * import { mockSanityImageUrl } from './test-utils';
 *
 * jest.mock('../../lib/shared/sanity-image-url', () => mockSanityImageUrl());
 */
export function mockSanityImageUrl(
  overrides?: Partial<SanityImageUrlMocks>,
): SanityImageUrlMocks {
  const defaultMocks = {
    getImageUrl: jest.fn((_image, width) => `mock-image-url-${width}`),
    getPlaceholderImage: jest.fn(() => "mock-placeholder-url"),
  };

  const mocks = { ...defaultMocks, ...overrides };

  return mocks;
}
jest.mock("./lib/shared/sanity-image-url", () => mockSanityImageUrl());
