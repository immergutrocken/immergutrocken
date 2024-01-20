import { useEffect, useState } from "react";
import { NotificationDisplayCategory } from "../lib/enums/notificationDisplayCategory";
import { INotification } from "../lib/notification";
import Content from "./block-content/content";
import Button from "./shared/button";

interface NotificationProps {
  notification: INotification;
}

const Notification = ({ notification }: NotificationProps): JSX.Element => {
  const [show, setShow] = useState(false);

  const key =
    "ig-notification-" + notification.title.toLowerCase().replace(/\s/g, "-");
  const notAccepted = "not-accepted";
  const accepted = "accepted";

  useEffect(() => {
    if (!localStorage?.getItem(key)) {
      localStorage?.setItem(key, notAccepted);
    }

    const startDate = notification.startDate
      ? new Date(notification.startDate)
      : null;
    const endDate = notification.endDate
      ? new Date(notification.endDate)
      : null;

    const isAccepted: boolean = localStorage?.getItem(key) === accepted;
    const isBeforeStartDate: boolean =
      startDate != null ? Date.now() < startDate.getTime() : false;
    const isAfterEndDate: boolean =
      endDate != null ? Date.now() > endDate.getTime() : false;

    if (!isAccepted && !isBeforeStartDate && !isAfterEndDate) {
      setShow(true);
    }
  }, [key, show, notification.startDate, notification.endDate]);

  const buildFooterNotification = (): JSX.Element => (
    <>
      {show && (
        <div className={`bg-secondary border-t-2 border-primary p-3 sm:pt-6`}>
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
                setShow(false);
                localStorage.setItem(key, accepted);
              }}
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const buildPopupNotification = (): JSX.Element => (
    <>
      {show && (
        <div
          className={`fixed top-0 left-0 z-20 bg-gray-600 bg-opacity-25 w-full h-full flex justify-center`}
        >
          <div className="self-center p-5 mx-2 border-2 rounded-lg w-100 sm:w-2/3 xl:w-1/2 bg-secondary font-important border-primary">
            <div className="text-3xl text-center sm:text-6xl">
              {notification.title}
            </div>
            <div className="font-content">
              <Content content={notification.content} />
            </div>
            <div className="flex justify-end mt-5">
              <Button
                size="small"
                click={() => {
                  setShow(false);
                  localStorage.setItem(key, accepted);
                }}
              >
                Ok
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (notification.display === NotificationDisplayCategory.FOOTER)
    return buildFooterNotification();
  else return buildPopupNotification();
};

export default Notification;
