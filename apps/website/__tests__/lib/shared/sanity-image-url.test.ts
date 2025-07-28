import { mockGetPlaiceholder, mockImageUrlBuilder } from "../../../jest.setup";
import {
  getImageUrl,
  getPlaceholderImage,
  SanityImage,
} from "../../../lib/shared/sanity-image-url";

jest.unmock("../../../lib/shared/sanity-image-url");

describe("sanity-image-url", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getImageUrl", () => {
    const mockSanityImage: SanityImage = {
      hotspot: {
        x: 0.5,
        y: 0.6,
      },
      asset: { _ref: "image-ref-123" },
      urlPreview: "",
      urlPreviewBlur: "",
      url: "",
      urlBlur: "",
      alt: "Test image",
      credits: "Test credits",
    };

    it("should generate image URL with hotspot", () => {
      const result = getImageUrl(mockSanityImage, 100, 200);

      expect(mockImageUrlBuilder.image).toHaveBeenCalledWith(
        mockSanityImage.asset,
      );
      expect(mockImageUrlBuilder.height).toHaveBeenCalledWith(100);
      expect(mockImageUrlBuilder.width).toHaveBeenCalledWith(200);
      expect(mockImageUrlBuilder.fit).toHaveBeenCalledWith("crop");
      expect(mockImageUrlBuilder.crop).toHaveBeenCalledWith("focalpoint");
      expect(mockImageUrlBuilder.focalPoint).toHaveBeenCalledWith(0.5, 0.6);
      expect(mockImageUrlBuilder.url).toHaveBeenCalled();
      expect(result).toBe("mock-sanity-image-url");
    });

    it("should generate image URL without hotspot", () => {
      const imageWithoutHotspot = {
        ...mockSanityImage,
        hotspot: undefined,
      } as unknown as SanityImage;

      const result = getImageUrl(imageWithoutHotspot, 100, 200);

      expect(mockImageUrlBuilder.image).toHaveBeenCalledWith(
        mockSanityImage.asset,
      );
      expect(mockImageUrlBuilder.height).toHaveBeenCalledWith(100);
      expect(mockImageUrlBuilder.width).toHaveBeenCalledWith(200);
      expect(mockImageUrlBuilder.fit).toHaveBeenCalledWith("crop");
      expect(mockImageUrlBuilder.crop).toHaveBeenCalledWith("center");
      expect(mockImageUrlBuilder.focalPoint).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.url).toHaveBeenCalled();
      expect(result).toBe("mock-sanity-image-url");
    });

    it("should generate image URL with only height", () => {
      const result = getImageUrl(mockSanityImage, 100, null);

      expect(mockImageUrlBuilder.height).toHaveBeenCalledWith(100);
      expect(mockImageUrlBuilder.width).not.toHaveBeenCalled();
      expect(result).toBe("mock-sanity-image-url");
    });

    it("should generate image URL with only width", () => {
      const result = getImageUrl(mockSanityImage, null, 200);

      expect(mockImageUrlBuilder.height).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.width).toHaveBeenCalledWith(200);
      expect(result).toBe("mock-sanity-image-url");
    });

    it("should generate image URL without dimensions", () => {
      const result = getImageUrl(mockSanityImage, null, null);

      expect(mockImageUrlBuilder.height).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.width).not.toHaveBeenCalled();
      expect(result).toBe("mock-sanity-image-url");
    });

    it("should generate image URL with default parameters", () => {
      const result = getImageUrl(mockSanityImage);

      expect(mockImageUrlBuilder.height).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.width).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.fit).toHaveBeenCalledWith("crop");
      expect(mockImageUrlBuilder.crop).toHaveBeenCalledWith("focalpoint");
      expect(mockImageUrlBuilder.focalPoint).toHaveBeenCalledWith(0.5, 0.6);
      expect(result).toBe("mock-sanity-image-url");
    });
  });

  describe("getPlaceholderImage", () => {
    const mockSanityImage: SanityImage = {
      hotspot: {
        x: 0.3,
        y: 0.7,
      },
      asset: { _ref: "image-ref-456" },
      urlPreview: "",
      urlPreviewBlur: "",
      url: "",
      urlBlur: "",
      alt: "Test placeholder",
      credits: "Test credits",
    };

    beforeEach(() => {
      mockGetPlaiceholder.mockResolvedValue({
        base64: "mock-base64-placeholder",
      });
    });

    it("should generate placeholder image with hotspot", async () => {
      const result = await getPlaceholderImage(mockSanityImage);

      expect(mockImageUrlBuilder.image).toHaveBeenCalledWith(
        mockSanityImage.asset,
      );
      expect(mockImageUrlBuilder.height).toHaveBeenCalledWith(10);
      expect(mockImageUrlBuilder.fit).toHaveBeenCalledWith("crop");
      expect(mockImageUrlBuilder.crop).toHaveBeenCalledWith("focalpoint");
      expect(mockImageUrlBuilder.focalPoint).toHaveBeenCalledWith(0.3, 0.7);
      expect(mockImageUrlBuilder.url).toHaveBeenCalled();

      expect(global.fetch).toHaveBeenCalledWith("mock-sanity-image-url");
      expect(mockGetPlaiceholder).toHaveBeenCalledWith(expect.any(Buffer), {
        size: 10,
      });
      expect(result).toBe("mock-base64-placeholder");
    });

    it("should generate placeholder image without hotspot", async () => {
      const imageWithoutHotspot = {
        ...mockSanityImage,
        hotspot: undefined,
      } as unknown as SanityImage;

      const result = await getPlaceholderImage(imageWithoutHotspot);

      expect(mockImageUrlBuilder.image).toHaveBeenCalledWith(
        mockSanityImage.asset,
      );
      expect(mockImageUrlBuilder.height).toHaveBeenCalledWith(10);
      expect(mockImageUrlBuilder.width).toHaveBeenCalledWith(10);
      expect(mockImageUrlBuilder.fit).toHaveBeenCalledWith("crop");
      expect(mockImageUrlBuilder.crop).toHaveBeenCalledWith("center");
      expect(mockImageUrlBuilder.focalPoint).not.toHaveBeenCalled();
      expect(mockImageUrlBuilder.url).toHaveBeenCalled();

      expect(global.fetch).toHaveBeenCalledWith("mock-sanity-image-url");
      expect(mockGetPlaiceholder).toHaveBeenCalledWith(expect.any(Buffer), {
        size: 10,
      });
      expect(result).toBe("mock-base64-placeholder");
    });

    it("should handle fetch and buffer conversion", async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      (global.fetch as jest.Mock).mockResolvedValue({
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      });

      await getPlaceholderImage(mockSanityImage);

      expect(global.fetch).toHaveBeenCalledWith("mock-sanity-image-url");
      expect(mockGetPlaiceholder).toHaveBeenCalledWith(expect.any(Buffer), {
        size: 10,
      });
    });
  });
});
