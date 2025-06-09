import { Locale } from "../../lib/enums/locals.enum";
import { getMerch } from "../../lib/merch";
import { sanityClient } from "../../lib/shared/sanity-client";

jest.mock("@sanity/client", () => ({
  createClient: () => ({
    fetch: jest.fn().mockReturnValue([
      {
        descriptionDe: ["Beschreibung auf Deutsch"],
        descriptionEn: ["Description in English"],
        productList: [
          {
            titleDe: "Produkt 1",
            titleEn: "Product 1",
            categoryDe: "Kategorie 1",
            categoryEn: "Category 1",
            descriptionDe: ["Beschreibung Produkt 1 auf Deutsch"],
            descriptionEn: ["Description of Product 1 in English"],
            images: [
              {
                _type: "image",
                asset: { _ref: "image-asset-ref-123" },
                alt: "Bildbeschreibung",
              },
            ],
          },
        ],
      },
    ]),
  }),
}));

jest.mock("../../lib/shared/sanity-image-url", () => ({
  getImageUrl: jest.fn((_image, width) => `mock-image-url-${width}`),
  getPlaceholderImage: jest.fn().mockResolvedValue("mock-placeholder-url"),
}));

describe("Merch", () => {
  it("should return german version of merch data", async () => {
    const result = await getMerch(Locale.DE);

    expect(result).toEqual({
      description: ["Beschreibung auf Deutsch"],
      productList: [
        {
          title: "Produkt 1",
          category: "Kategorie 1",
          description: ["Beschreibung Produkt 1 auf Deutsch"],
          images: [
            {
              _type: "image",
              asset: { _ref: "image-asset-ref-123" },
              url: "mock-image-url-1000",
              urlPreview: "mock-image-url-300",
              urlPreviewBlur: "mock-placeholder-url",
              alt: "Bildbeschreibung",
            },
          ],
        },
      ],
    });
    expect(sanityClient.fetch).toHaveBeenCalled();
  });

  it("should return english version of merch data", async () => {
    const result = await getMerch(Locale.EN);

    expect(result).toEqual({
      description: ["Description in English"],
      productList: [
        {
          title: "Product 1",
          category: "Category 1",
          description: ["Description of Product 1 in English"],
          images: [
            {
              _type: "image",
              asset: { _ref: "image-asset-ref-123" },
              url: "mock-image-url-1000",
              urlBlur: "mock-placeholder-url",
              urlPreview: "mock-image-url-300",
              urlPreviewBlur: "mock-placeholder-url",
              alt: "Bildbeschreibung",
            },
          ],
        },
      ],
    });
    expect(sanityClient.fetch).toHaveBeenCalled();
  });

  it("should reject if no merch data is found", async () => {
    (sanityClient.fetch as jest.Mock).mockResolvedValueOnce([]);
    await expect(getMerch(Locale.DE)).rejects.toEqual("No merch found");
  });
});
