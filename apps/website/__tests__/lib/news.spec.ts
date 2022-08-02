import { getNewsLinkList } from "../../lib/news";
import client from "../../lib/shared/sanityClient";

jest.mock("@sanity/client");

describe("News", () => {
  xit("getNewsList", () => {
    getNewsLinkList("de");
    expect(client.fetch).toHaveBeenCalled();
  });
});
