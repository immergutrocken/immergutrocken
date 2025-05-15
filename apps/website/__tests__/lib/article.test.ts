import { getArticle, getArticleSlugList } from "../../lib/article";
import { sanityClient } from "../../lib/shared/sanity-client";

jest.mock("../../lib/shared/sanity-client", () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}));

jest.mock("../../lib/shared/sanity-image-url", () => ({
  getImageUrl: jest.fn((_image, width) => `mock-image-url-${width}`),
  getPlaceholderImage: jest.fn().mockResolvedValue("mock-placeholder-url"),
}));

describe("Article Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getArticleSlugList", () => {
    it("should fetch and return article slugs", async () => {
      const mockSlugs = [{ slug: "article-1" }, { slug: "article-2" }];

      (sanityClient.fetch as jest.Mock).mockResolvedValueOnce(mockSlugs);

      const result = await getArticleSlugList();

      expect(sanityClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining("*[_type == 'article']{'slug': slug.current}"),
      );
      expect(result).toEqual(["article-1", "article-2"]);
    });
  });

  describe("getArticle", () => {
    const mockArticle = [
      {
        titleDe: "Deutscher Titel",
        titleEn: "English Title",
        subtitleDe: "Deutscher Untertitel",
        subtitleEn: "English Subtitle",
        banner: {
          alt: "Banner Alt Text",
          asset: { _ref: "image-ref-123" },
          credits: "Image Credits",
        },
        author: "Test Author",
        ogDescription: "Meta Description",
        contentDe: [
          {
            _type: "block",
            _key: "key1",
            children: [{ text: "Deutscher Inhalt" }],
          },
          {
            _type: "imageGallery",
            _key: "gallery1",
            images: [
              {
                _type: "image",
                asset: { _ref: "image-ref-456" },
                alt: "Gallery Image 1",
              },
            ],
          },
        ],
        contentEn: [
          {
            _type: "block",
            _key: "key2",
            children: [{ text: "English Content" }],
          },
        ],
      },
    ];

    beforeEach(() => {
      (sanityClient.fetch as jest.Mock).mockResolvedValue(mockArticle);
    });

    it("should return article with German content when locale is 'de'", async () => {
      const result = await getArticle("test-slug", "de");

      expect(sanityClient.fetch).toHaveBeenCalled();

      expect(result).toMatchObject({
        title: "Deutscher Titel",
        subtitle: "Deutscher Untertitel",
        author: "Test Author",
        content: mockArticle[0].contentDe,
      });

      expect(result.banner.url).toBe("mock-image-url-1000");
      expect(result.banner.urlWithBlur).toBe("mock-placeholder-url");
    });

    it("should return article with English content when locale is 'en'", async () => {
      const result = await getArticle("test-slug", "en");

      expect(result).toMatchObject({
        title: "English Title",
        subtitle: "English Subtitle",
        content: mockArticle[0].contentEn,
      });
    });

    it("should process imageGallery correctly", async () => {
      const result = await getArticle("test-slug", "de");

      const typedContent = result.content as Array<{
        _type?: string;
        images?: Array<{
          url: string;
          urlPreview: string;
          urlPreviewBlur: string;
          urlBlur: string;
        }>;
      }>;

      const imageGallery = typedContent.find(
        (item) => item._type === "imageGallery",
      );

      expect(imageGallery).toBeDefined();

      if (
        imageGallery &&
        imageGallery.images &&
        imageGallery.images.length > 0
      ) {
        const image = imageGallery.images[0];
        expect(image.urlPreview).toBe("mock-image-url-400");
        expect(image.url).toBe("mock-image-url-1000");
        expect(image.urlPreviewBlur).toBe("mock-placeholder-url");
        expect(image.urlBlur).toBe("mock-placeholder-url");
      }
    });
  });
});
