import { Locale } from "../../lib/enums/locals.enum";
import { getNewsLinkList } from "../../lib/news";
import { sanityClient } from "../../lib/shared/sanityClient";

jest.mock("@sanity/client", () => ({
  createClient: () => ({
    fetch: jest.fn().mockReturnValue([
      {
        slug: ["slug1", "slug2"],
        titleDe: ["titleDe1", "titleDe2"],
        titleEn: ["titleEn1", "titleEn2"],
      },
    ]),
  }),
}));

describe("News", () => {
  it("should return german version of news link list", async () => {
    const result = await getNewsLinkList(Locale.DE);

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(result).toEqual([
      { title: "titleDe1", slug: "slug1" },
      { title: "titleDe2", slug: "slug2" },
    ]);
  });

  it("should return english version of news link list", async () => {
    const result = await getNewsLinkList(Locale.EN);

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(result).toEqual([
      { title: "titleEn1", slug: "slug1" },
      { title: "titleEn2", slug: "slug2" },
    ]);
  });
});
