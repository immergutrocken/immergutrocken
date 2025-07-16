import { sanityClientFetchMock } from "../../jest.setup";
import { Locale } from "../../lib/enums/locals.enum";
import { NotificationDisplayCategory } from "../../lib/enums/notificationDisplayCategory";
import { getNotificationList, INotification } from "../../lib/notification";

describe("Notification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sanityClientFetchMock.mockReturnValue([
      {
        title: "title",
        titleDe: "German",
        titleEn: "English",
        contentDe: ["German"],
        contentEn: ["English"],
        display: NotificationDisplayCategory.FOOTER,
        startDate: new Date("2021-01-01"),
        endDate: new Date("2021-12-31"),
      },
    ]);
  });

  it("should return german version of notification list", async () => {
    const result = await getNotificationList(Locale.DE);

    expect(sanityClientFetchMock).toHaveBeenCalled();
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

    expect(sanityClientFetchMock).toHaveBeenCalled();
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
