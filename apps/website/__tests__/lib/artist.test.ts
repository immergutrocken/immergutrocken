import { sanityClientFetchMock } from "../../jest.setup";
import { getArtist, getArtistLinkList, getArtistList } from "../../lib/artist";
import { ArtistCategory } from "../../lib/enums/artistCategory.enum";
import { SocialMedia } from "../../lib/enums/socialMedia.enum";

describe("Artist", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getArtistList", () => {
    it("should fetch and return artist slugs", async () => {
      const mockSlugs = [{ slug: "artist-1" }, { slug: "artist-2" }];
      sanityClientFetchMock.mockResolvedValueOnce(mockSlugs);
      const result = await getArtistList();
      expect(sanityClientFetchMock).toHaveBeenCalledWith(
        expect.stringContaining("*[_type == 'artist']{'slug': slug.current}"),
      );
      expect(result).toEqual(mockSlugs);
    });
  });

  describe("getArtistLinkList", () => {
    it("should map artist links for German locale", async () => {
      const mockResult = [
        {
          titlesDe: ["Künstler 1", "Künstler 2"],
          titlesEn: ["Artist 1", "Artist 2"],
          slugs: ["artist-1", "artist-2"],
          categories: ["music", "reading"],
        },
      ];
      sanityClientFetchMock.mockResolvedValueOnce(mockResult);
      const result = await getArtistLinkList("de");
      expect(result).toEqual([
        {
          title: "Künstler 1",
          slug: "artist-1",
          category: ArtistCategory.MUSIC,
        },
        {
          title: "Künstler 2",
          slug: "artist-2",
          category: ArtistCategory.READING,
        },
      ]);
    });
    it("should map artist links for English locale", async () => {
      const mockResult = [
        {
          titlesDe: ["Künstler 1", "Künstler 2"],
          titlesEn: ["Artist 1", "Artist 2"],
          slugs: ["artist-1", "artist-2"],
          categories: ["music", "reading"],
        },
      ];
      sanityClientFetchMock.mockResolvedValueOnce(mockResult);
      const result = await getArtistLinkList("en");
      expect(result).toEqual([
        { title: "Artist 1", slug: "artist-1", category: ArtistCategory.MUSIC },
        {
          title: "Artist 2",
          slug: "artist-2",
          category: ArtistCategory.READING,
        },
      ]);
    });
  });

  describe("getArtist", () => {
    const mockArtist = [
      {
        titleDe: "Künstler 1",
        titleEn: "Artist 1",
        banner: {
          alt: "Banner Alt Text",
          asset: { _ref: "image-ref-123" },
          credits: "Image Credits",
        },
        author: "Test Author",
        ogDescription: "Meta Description",
        performance: { stage: "Main", time: "20:00" },
        socialMedia: [
          {
            medium: "Instagram",
            link: { url: "https://instagram.com/artist" },
          },
          { medium: "Website", link: { url: "https://artist.com" } },
        ],
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
      sanityClientFetchMock.mockResolvedValue(mockArtist);
    });

    it("should return artist with German content when locale is 'de'", async () => {
      const result = await getArtist("test-slug", "de");
      expect(sanityClientFetchMock).toHaveBeenCalled();
      expect(result).toMatchObject({
        title: "Künstler 1",
        author: "Test Author",
        content: mockArtist[0].contentDe,
      });
      expect(result.banner.url).toBe("mock-image-url-1000");
      expect(result.banner.urlWithBlur).toBe("mock-placeholder-url");
    });

    it("should return artist with English content when locale is 'en'", async () => {
      const result = await getArtist("test-slug", "en");
      expect(result).toMatchObject({
        title: "Artist 1",
        content: mockArtist[0].contentEn,
      });
    });

    it("should process imageGallery correctly", async () => {
      const result = await getArtist("test-slug", "de");
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
      if (imageGallery?.images && imageGallery.images.length > 0) {
        const image = imageGallery.images[0];
        expect(image.urlPreview).toBe("mock-image-url-400");
        expect(image.url).toBe("mock-image-url-1000");
        expect(image.urlPreviewBlur).toBe("mock-placeholder-url");
        expect(image.urlBlur).toBe("mock-placeholder-url");
      }
    });

    it("should map social media correctly", async () => {
      const result = await getArtist("test-slug", "de");
      expect(result.socialMedia).toEqual([
        { type: SocialMedia.INSTAGRAM, url: "https://instagram.com/artist" },
        { type: SocialMedia.WEBSITE, url: "https://artist.com" },
      ]);
    });
  });
});
