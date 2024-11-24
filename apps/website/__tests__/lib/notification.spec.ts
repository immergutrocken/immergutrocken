import { getNotificationList } from "../../lib/notification";
import client from "../../lib/shared/sanityClient";

jest.mock("@sanity/client", () => ({
  createClient: () => ({
    fetch: jest.fn(),
  }),
}));

describe("Notification", () => {
  it("getNotificationList", () => {
    getNotificationList("de");
    expect(client.fetch).toHaveBeenCalled();
  });
});
