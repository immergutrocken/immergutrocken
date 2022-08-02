import { useEffect, useState } from "react";
import { NotificationDisplayCategory } from "../lib/enums/notificationDisplayCategory";
import { INotification } from "../lib/notification";
import Content from "./block-content/content";
import Button from "./shared/button";

interface NotificationProps {
  notification: INotification;
}

const Notification = ({ notification }: NotificationProps): JSX.Element => {
  const [hidden, setHidden] = useState(false);

  const key =
    "ig-notification-" + notification.title.toLowerCase().replace(/\s/g, "-");
  const notAccepted = "not-accepted";
  const accepted = "accepted";

  useEffect(() => {
    if (!localStorage?.getItem(key)) {
      localStorage?.setItem(key, notAccepted);
    }

    if (!hidden && localStorage?.getItem(key) === accepted) {
      setHidden(true);
    }

    const startDate = notification.startDate
      ? new Date(notification.startDate)
      : null;
    const endDate = notification.endDate
      ? new Date(notification.endDate)
      : null;
    if (
      !hidden &&
      (Date.now() < startDate?.getTime() || endDate?.getTime() < Date.now())
    ) {
      setHidden(true);
    }
  }, [key, hidden, notification.startDate, notification.endDate]);

  const buildFooterNotification = (): JSX.Element => (
    <div
      className={`bg-secondary border-t-2 border-primary p-3 sm:pt-6 ${
        hidden ? "hidden" : ""
      }`}
    >
      <div className="text-3xl sm:text-6xl font-important">
        {notification.title}
      </div>
      <div className="font-content">
        <Content content={notification.content} />
      </div>
      <div className="text-right">
        <Button
          size="small"
          click={() => {
            setHidden(true);
            localStorage.setItem(key, accepted);
          }}
        >
          Ok
        </Button>
      </div>
    </div>
  );

  const buildPopupNotification = (): JSX.Element => (
    <div
      className={`fixed top-0 left-0 z-20 bg-gray-600 bg-opacity-25 w-full h-full flex justify-center ${
        hidden ? "hidden" : ""
      }`}
    >
      <div className="self-center w-1/2 p-5 bg-white">
        <div className="text-3xl sm:text-6xl">{notification.title}</div>
        <div className="font-content">
          <Content content={notification.content} />
        </div>
        <div className="text-right">
          <Button
            size="small"
            click={() => {
              setHidden(true);
              localStorage.setItem(key, accepted);
            }}
          >
            Ok
          </Button>
        </div>
      </div>
    </div>
  );

  if (notification.display === NotificationDisplayCategory.FOOTER)
    return buildFooterNotification();
  else return buildPopupNotification();
};

export default Notification;
