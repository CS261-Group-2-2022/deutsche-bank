import { Popover, Transition } from "@headlessui/react";
import { ArrowRightIcon, BellIcon, XIcon } from "@heroicons/react/solid";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import {
  DELETE_NOTIFICATION,
  getAuthToken,
  LIST_ALL_NOTIFICATIONS,
  Notification,
  NotificationType,
} from "../utils/endpoints";

export const applyNotificationAction = (
  notification: Notification,
  navigate: NavigateFunction
) => {
  switch (notification.type) {
    case NotificationType.BUSINESS_AREA_CONFLICT: {
      // TODO: link to mentee page
      break;
    }
    case NotificationType.MENTORSHIP_REQUEST_RECEIVED: {
      // Navigate to your mentees list
      navigate("/mentoring/mentees");
      break;
    }
    case NotificationType.MEETING_REQUEST_RECEIVED: {
      // Navigate to meetings page for this mentee
      navigate(`/mentoring/${notification.action.mentee}?tab=meetings`);
      break;
    }
    case NotificationType.MEETING_NOTES_MENTOR: {
      // Navigate to meetings page for this mentor
      navigate("/mentoring/me?tab=meetings");
      break;
    }
    case NotificationType.MEETING_NOTES_MENTEE: {
      // Navigate to meetings page for this mentee
      navigate(`/mentoring/${notification.action.mentee}?tag=meetings`);
      break;
    }
  }
};

type NotificationPanelProps = {
  notification: Notification;
};

const NotificationPanel = ({ notification }: NotificationPanelProps) => {
  const navigate = useNavigate();
  const datetime = DateTime.fromISO(notification.date);

  const hasAction = notification.action !== undefined;
  const isImportant = hasAction;

  const [error, setError] = useState<string | undefined>();

  const deleteNotification = async () => {
    setError(undefined);

    const res = await fetch(
      DELETE_NOTIFICATION.replace("{ID}", notification.id.toString()),
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
      }
    );

    const body = await res.json();

    if (res.ok) {
      // Revalidate the caches for notifications
      mutate(LIST_ALL_NOTIFICATIONS);
    } else {
      setError(
        body.error ??
          "An error occured when deleting this notification. Please try again."
      );
    }
  };

  return (
    <div
      className={`${
        notification.seen ? "bg-white" : "bg-gray-100"
      } flex justify-between px-2 py-1`}
    >
      <div>
        <div className="flex items-center gap-2">
          {isImportant && (
            <div className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
          )}

          <p className="text-md font-medium">{notification.title}</p>
        </div>
        <p className="text-sm text-gray-600">{datetime.toRelative()}</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-2 items-center">
        {hasAction && (
          <button
            className="rounded-lg bg-blue-600 text-white p-2"
            onClick={() => applyNotificationAction(notification, navigate)}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        )}
        {!isImportant && (
          <button onClick={deleteNotification}>
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPopup() {
  const { data: notifications } = useSWR<Notification[]>(
    LIST_ALL_NOTIFICATIONS
  );

  const importantNotifications =
    notifications &&
    notifications.find(
      (notification) => !notification.seen || notification.action !== undefined
    );

  // TODO: WHEN OPENED, MARK NOTIFICATIONS AS SEEN

  return (
    <div>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={
                open
                  ? "text-gray-900"
                  : importantNotifications
                  ? "text-red-600 hover:text-red-700"
                  : "text-gray-600 hover:text-gray-700"
              }
            >
              <BellIcon className={"aspect-square w-5"} aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-full left-2/3 sm:px-0 lg:max-w-xl">
                <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                  <div className="relative flex flex-col gap-2 bg-white">
                    {notifications && notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <NotificationPanel
                          key={notification.id}
                          notification={notification}
                        />
                      ))
                    ) : (
                      <p className="font-medium text-center text-gray-700">
                        No new notifications
                      </p>
                    )}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
