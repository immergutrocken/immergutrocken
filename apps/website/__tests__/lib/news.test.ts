import { sanityClientFetchMock } from "../../jest.setup";
import { Locale } from "../../lib/enums/locals.enum";
import { getNewsLinkList } from "../../lib/news";

describe("News", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sanityClientFetchMock.mockReturnValue([
      {
        slug: ["slug1", "slug2"],
        titleDe: ["titleDe1", "titleDe2"],
        titleEn: ["titleEn1", "titleEn2"],
      },
    ]);
  });

  it("should return german version of news link list", async () => {
    const result = await getNewsLinkList(Locale.DE);

    expect(sanityClientFetchMock).toHaveBeenCalled();
    expect(result).toEqual([
      { title: "titleDe1", slug: "slug1" },
      { title: "titleDe2", slug: "slug2" },
    ]);
  });

  it("should return english version of news link list", async () => {
    const result = await getNewsLinkList(Locale.EN);

    expect(sanityClientFetchMock).toHaveBeenCalled();
    expect(result).toEqual([
      { title: "titleEn1", slug: "slug1" },
      { title: "titleEn2", slug: "slug2" },
    ]);
  });
});
