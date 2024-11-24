import { Locale } from "../../lib/enums/locals.enum";
import { NotificationDisplayCategory } from "../../lib/enums/notificationDisplayCategory";
import { getNotificationList, INotification } from "../../lib/notification";
import { sanityClient } from "../../lib/shared/sanity-client";

jest.mock("@sanity/client", () => ({
  createClient: jest.fn(() => ({
    fetch: jest.fn().mockReturnValue([
      <Partial<INotification>>{
        title: "title",
        titleEn: "English",
        titleDe: "German",
        contentEn: ["English"],
        contentDe: ["German"],
        display: NotificationDisplayCategory.FOOTER,
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-12-31"),
      },
    ]),
  })),
}));

describe("Notification", () => {
  it("should return german version of notification list", async () => {
    const result = await getNotificationList(Locale.DE);

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(result).toEqual([
      <Partial<INotification>>{
        title: "German",
        content: ["German"],
        display: NotificationDisplayCategory.FOOTER,
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-12-31"),
      },
    ]);
  });

  it("should return english version of notification list", async () => {
    const result = await getNotificationList(Locale.EN);

    expect(sanityClient.fetch).toHaveBeenCalled();
    expect(result).toEqual([
      <Partial<INotification>>{
        title: "English",
        content: ["English"],
        display: NotificationDisplayCategory.FOOTER,
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-12-31"),
      },
    ]);
  });
});
