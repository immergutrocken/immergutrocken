import { sanityClientFetchMock } from "../../jest.setup";
import PartnerCategory from "../../lib/enums/partnerCategory.enum";
import { getPartnerList } from "../../lib/partner";

describe("Partner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPartnerList", () => {
    const mockPartnerData = [
      {
        link: [
          "https://partner1.com",
          "https://partner2.com",
          "https://partner3.com",
        ],
        logo: [
          {
            asset: { _ref: "image-ref-1" },
            alt: "Partner 1 Logo",
            credits: "Partner 1",
            height: 100,
            width: 200,
            hotspot: { x: 0.5, y: 0.5 },
          },
          {
            asset: { _ref: "image-ref-2" },
            alt: "Partner 2 Logo",
            credits: "Partner 2",
            height: 150,
            width: 300,
            hotspot: { x: 0.5, y: 0.5 },
          },
          {
            asset: { _ref: "image-ref-3" },
            alt: "Partner 3 Logo",
            credits: "Partner 3",
            height: 80,
            width: 160,
            hotspot: { x: 0.5, y: 0.5 },
          },
        ],
      },
    ];

    it("should return sponsor partners", async () => {
      sanityClientFetchMock.mockResolvedValueOnce(mockPartnerData);

      const result = await getPartnerList(PartnerCategory.SPONSOR);

      expect(sanityClientFetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          "*[_type == 'sortings'] {'link': sponsors[]->link.url, 'logo': sponsors[]->logo}",
        ),
      );

      expect(result).toEqual([
        {
          link: "https://partner1.com",
          logo: {
            asset: { _ref: "image-ref-1" },
            alt: "Partner 1 Logo",
            credits: "Partner 1",
            height: 100,
            width: 200,
            hotspot: { x: 0.5, y: 0.5 },
            url: "mock-image-url-100",
          },
        },
        {
          link: "https://partner2.com",
          logo: {
            asset: { _ref: "image-ref-2" },
            alt: "Partner 2 Logo",
            credits: "Partner 2",
            height: 150,
            width: 300,
            hotspot: { x: 0.5, y: 0.5 },
            url: "mock-image-url-150",
          },
        },
        {
          link: "https://partner3.com",
          logo: {
            asset: { _ref: "image-ref-3" },
            alt: "Partner 3 Logo",
            credits: "Partner 3",
            height: 80,
            width: 160,
            hotspot: { x: 0.5, y: 0.5 },
            url: "mock-image-url-80",
          },
        },
      ]);
    });

    it("should return media partners", async () => {
      sanityClientFetchMock.mockResolvedValueOnce(mockPartnerData);

      const result = await getPartnerList(PartnerCategory.MEDIA_PARTNER);

      expect(sanityClientFetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          "*[_type == 'sortings'] {'link': mediaPartner[]->link.url, 'logo': mediaPartner[]->logo}",
        ),
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        link: "https://partner1.com",
        logo: expect.objectContaining({
          alt: "Partner 1 Logo",
          credits: "Partner 1",
          height: 100,
          width: 200,
          url: "mock-image-url-100",
        }),
      });
    });

    it("should return additional partners", async () => {
      sanityClientFetchMock.mockResolvedValueOnce(mockPartnerData);

      const result = await getPartnerList(PartnerCategory.ADDITIONAL);

      expect(sanityClientFetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          "*[_type == 'sortings'] {'link': additionalPartner[]->link.url, 'logo': additionalPartner[]->logo}",
        ),
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        link: "https://partner1.com",
        logo: expect.objectContaining({
          alt: "Partner 1 Logo",
          url: "mock-image-url-100",
        }),
      });
    });

    it("should handle empty partner list", async () => {
      const emptyMockData = [
        {
          link: [],
          logo: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(emptyMockData);

      const result = await getPartnerList(PartnerCategory.SPONSOR);

      expect(result).toEqual([]);
    });

    it("should handle single partner", async () => {
      const singlePartnerData = [
        {
          link: ["https://single-partner.com"],
          logo: [
            {
              asset: { _ref: "image-ref-single" },
              alt: "Single Partner Logo",
              credits: "Single Partner",
              height: 120,
              width: 240,
              hotspot: { x: 0.5, y: 0.5 },
            },
          ],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(singlePartnerData);

      const result = await getPartnerList(PartnerCategory.MEDIA_PARTNER);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        link: "https://single-partner.com",
        logo: {
          asset: { _ref: "image-ref-single" },
          alt: "Single Partner Logo",
          credits: "Single Partner",
          height: 120,
          width: 240,
          hotspot: { x: 0.5, y: 0.5 },
          url: "mock-image-url-120",
        },
      });
    });

    it("should preserve logo properties including image URL generation", async () => {
      const mockDataWithSpecificProps = [
        {
          link: ["https://test-partner.com"],
          logo: [
            {
              asset: { _ref: "image-test-ref" },
              alt: "Test Logo Alt",
              credits: "Test Credits",
              height: 75,
              width: 150,
              hotspot: { x: 0.3, y: 0.7 },
            },
          ],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockDataWithSpecificProps);

      const result = await getPartnerList(PartnerCategory.ADDITIONAL);

      expect(result[0].logo).toEqual({
        asset: { _ref: "image-test-ref" },
        alt: "Test Logo Alt",
        credits: "Test Credits",
        height: 75,
        width: 150,
        hotspot: { x: 0.3, y: 0.7 },
        url: "mock-image-url-75",
      });
    });

    it("should handle partners with different logo dimensions", async () => {
      const mockDataWithDifferentDimensions = [
        {
          link: ["https://small-logo.com", "https://large-logo.com"],
          logo: [
            {
              asset: { _ref: "small-image-ref" },
              alt: "Small Logo",
              credits: "Small Partner",
              height: 50,
              width: 100,
              hotspot: { x: 0.5, y: 0.5 },
            },
            {
              asset: { _ref: "large-image-ref" },
              alt: "Large Logo",
              credits: "Large Partner",
              height: 200,
              width: 400,
              hotspot: { x: 0.5, y: 0.5 },
            },
          ],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(
        mockDataWithDifferentDimensions,
      );

      const result = await getPartnerList(PartnerCategory.SPONSOR);

      expect(result).toHaveLength(2);
      expect(result[0].logo.url).toBe("mock-image-url-50");
      expect(result[1].logo.url).toBe("mock-image-url-200");
    });
  });
});
