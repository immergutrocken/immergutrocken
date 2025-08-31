import { sanityClientFetchMock } from "../../jest.setup";
import { getGeneralSettings } from "../../lib/general-settings";

describe("GeneralSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResult = [
    {
      websiteTitleDe: "Immergut Festival",
      websiteTitleEn: "Immergut Festival EN",
      bannerDesktopDe: {
        alt: "Banner DE",
        asset: { _ref: "img-desktop-de" },
        credits: "Photographer DE",
        width: 1200,
        height: 600,
      },
      bannerDesktopEn: {
        alt: "Banner EN",
        asset: { _ref: "img-desktop-en" },
        credits: "Photographer EN",
        width: 1200,
        height: 600,
      },
      bannerMobileDe: {
        alt: "Mobile DE",
        asset: { _ref: "img-mobile-de" },
        credits: "Mobile Photographer DE",
        width: 600,
        height: 800,
      },
      bannerMobileEn: {
        alt: "Mobile EN",
        asset: { _ref: "img-mobile-en" },
        credits: "Mobile Photographer EN",
        width: 600,
        height: 800,
      },
      displayMode: "news",
      additionalTextAfterArtistsDe: "Zusatztext DE",
      additionalTextAfterArtistsEn: "Additional text EN",
      isPerformanceDetailsVisible: true,
      ticketshopUrl: "https://tickets.example.com",
      countdown: {
        showCountdown: true,
        festivalStartDate: "2025-05-30T12:00:00Z",
        festivalEndDate: "2025-06-01T23:59:59Z",
      },
    },
  ];

  it("should return general settings for German locale", async () => {
    sanityClientFetchMock.mockResolvedValueOnce(mockResult);
    const result = await getGeneralSettings("de");
    expect(result).toMatchObject({
      websiteTitle: "Immergut Festival",
      bannerDesktop: {
        alt: "Banner DE",
        asset: { _ref: "img-desktop-de" },
        credits: "Photographer DE",
        width: 1200,
        height: 600,
        url: "mock-image-url-undefined",
        urlWithBlur: "mock-placeholder-url",
      },
      bannerMobile: {
        alt: "Mobile DE",
        asset: { _ref: "img-mobile-de" },
        credits: "Mobile Photographer DE",
        width: 600,
        height: 800,
        url: "mock-image-url-undefined",
        urlWithBlur: "mock-placeholder-url",
      },
      showNewsAsPrimaryContent: true,
      additionalTextAfterArtists: "Zusatztext DE",
      isPerformanceDetailsVisible: true,
      ticketshopUrl: "https://tickets.example.com",
      countdown: expect.objectContaining({
        showCountdown: true,
        festivalStartDate: "2025-05-30T12:00:00Z",
        festivalEndDate: "2025-06-01T23:59:59Z",
      }),
    });
  });

  it("should return general settings for English locale", async () => {
    sanityClientFetchMock.mockResolvedValueOnce(mockResult);
    const result = await getGeneralSettings("en");
    expect(result).toMatchObject({
      websiteTitle: "Immergut Festival EN",
      bannerDesktop: {
        alt: "Banner EN",
        asset: { _ref: "img-desktop-en" },
        credits: "Photographer EN",
        width: 1200,
        height: 600,
        url: "mock-image-url-undefined",
        urlWithBlur: "mock-placeholder-url",
      },
      bannerMobile: {
        alt: "Mobile EN",
        asset: { _ref: "img-mobile-en" },
        credits: "Mobile Photographer EN",
        width: 600,
        height: 800,
        url: "mock-image-url-undefined",
        urlWithBlur: "mock-placeholder-url",
      },
      showNewsAsPrimaryContent: true,
      additionalTextAfterArtists: "Additional text EN",
      isPerformanceDetailsVisible: true,
      ticketshopUrl: "https://tickets.example.com",
      countdown: expect.objectContaining({
        showCountdown: true,
        festivalStartDate: "2025-05-30T12:00:00Z",
        festivalEndDate: "2025-06-01T23:59:59Z",
      }),
    });
  });

  it("should fallback to German values if English is missing", async () => {
    const partialResult = [
      {
        ...mockResult[0],
        websiteTitleEn: undefined,
        bannerDesktopEn: undefined,
        bannerMobileEn: undefined,
        additionalTextAfterArtistsEn: undefined,
      },
    ];
    sanityClientFetchMock.mockResolvedValueOnce(partialResult);
    const result = await getGeneralSettings("en");
    expect(result.websiteTitle).toBe("Immergut Festival");
    expect(result.bannerDesktop.alt).toBe("Banner DE");
    expect(result.bannerMobile.alt).toBe("Mobile DE");
    expect(result.additionalTextAfterArtists).toBe("Zusatztext DE");
  });

  it("should set showNewsAsPrimaryContent to true if displayMode is missing", async () => {
    const partialResult = [{ ...mockResult[0], displayMode: undefined }];
    sanityClientFetchMock.mockResolvedValueOnce(partialResult);
    const result = await getGeneralSettings("de");
    expect(result.showNewsAsPrimaryContent).toBe(true);
  });

  it("should set isPerformanceDetailsVisible to false if missing", async () => {
    const partialResult = [
      { ...mockResult[0], isPerformanceDetailsVisible: undefined },
    ];
    sanityClientFetchMock.mockResolvedValueOnce(partialResult);
    const result = await getGeneralSettings("de");
    expect(result.isPerformanceDetailsVisible).toBe(false);
  });
});
