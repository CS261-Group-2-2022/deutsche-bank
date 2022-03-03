import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import {
  getAuthToken,
  GroupSession,
  JoinSessionResponse,
  JoinSessionSuccess,
  JOIN_SESSION_ENDPOINT,
  LEAVE_SESSION_ENDPOINT,
  LIST_All_GROUP_SESSIONS_ENDPOINT,
  LIST_USER_JOINED_SESSIONS_ENDPOINT,
  LIST_USER_SUGGESTED_SESSIONS_ENDPOINT,
  User,
} from "../utils/endpoints";
import { useUser } from "../utils/authentication";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "./LocationText";
import DateText from "./DateText";
import Popup from "./Popup";
import CapacityText from "./CapacityText";
import { LoadingButton } from "./LoadingButton";
import UserAvatar from "./UserAvatar";

const RegisteredUser = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <img
          className="h-10 w-10 rounded-full"
          src={
            "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
          }
          alt="profile picture"
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          {user.first_name} {user.last_name}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    </div>
  );
};

const JOIN_BUTTON_COLOURS = [
  "bg-blue-700 hover:bg-blue-800",
  "text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500",
];
const LEAVE_BUTTON_COLOURS = [
  "bg-red-700 hover:bg-red-800",
  "text-red-900 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500",
];

/** Verifies whether a join response is succesful or not (and type guards the body) */
const isJoinSuccess = (
  res: Response,
  body: JoinSessionResponse
): body is JoinSessionSuccess => {
  return res.ok;
};

type SessionInfoPopupProps = {
  session?: GroupSession;
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function SessionInfoPopup({
  session,
  isOpen,
  closeModal,
}: SessionInfoPopupProps) {
  const { user } = useUser();

  const [isClosing, setIsClosing] = useState(false);

  // When we want to start closing the modal, we want to let the animation
  // start hiding the modal BEFORE we clear the session. Once the animation
  // has complete. we will then call `closeModal()` officially.
  const initiateClose = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    setIsClosing(false);
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const joinSession = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const res = await fetch(
        JOIN_SESSION_ENDPOINT.replace("{ID}", session?.id.toString() ?? ""),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Token ${getAuthToken()}`,
          },
        }
      );

      const body: JoinSessionResponse = await res.json();

      if (isJoinSuccess(res, body)) {
        // Update the list of available group sessions
        mutate(LIST_USER_SUGGESTED_SESSIONS_ENDPOINT);
        mutate(LIST_USER_SUGGESTED_SESSIONS_ENDPOINT);
        mutate(LIST_USER_JOINED_SESSIONS_ENDPOINT);
      } else {
        setError(body.error ?? "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveSession = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const res = await fetch(
        LEAVE_SESSION_ENDPOINT.replace("{ID}", session?.id.toString() ?? ""),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Token ${getAuthToken()}`,
          },
        }
      );

      const body: JoinSessionResponse = await res.json();

      if (isJoinSuccess(res, body)) {
        // Update the list of available group sessions
        mutate(LIST_All_GROUP_SESSIONS_ENDPOINT);
        mutate(LIST_USER_SUGGESTED_SESSIONS_ENDPOINT);
        mutate(LIST_USER_JOINED_SESSIONS_ENDPOINT);
      } else {
        setError(body.error ?? "An error occurred");
      }
    } catch (err) {
      setError("An error occurered");
    } finally {
      setIsLoading(false);
    }
  };

  const isHosting = session?.host.id == user?.id;
  const hasJoined = session?.users.find((u) => u.id == user?.id);
  const buttonColours =
    hasJoined && !isHosting ? LEAVE_BUTTON_COLOURS : JOIN_BUTTON_COLOURS;

  return (
    <Popup
      isOpen={isOpen}
      isClosing={isClosing}
      initiateClose={initiateClose}
      closeModal={closeModal}
      className="p-0 pb-3"
    >
      <img
        src={
          session?.image_link ??
          "https://thinkingportfolio.com/wp-content/uploads/2015/10/02G69046.jpg"
        }
        className="w-full rounded-t-2xl max-h-52 object-cover"
      />

      <div className="px-3 pt-3">
        <Dialog.Title as="h3" className="leading-6 text-gray-900 space-x-2">
          <span className="text-3xl font-black uppercase">{session?.name}</span>
        </Dialog.Title>
        <div className="pt-1 flex flex-wrap gap-1 text-md">
          {session?.skills?.map((skill) => (
            <SessionTopicLabel key={skill.id} name={skill.name} />
          ))}
        </div>
        <div className="my-2 flex flex-row gap-3 items-center">
          <div>
            <UserAvatar user={session?.host} size={12} />
          </div>
          <p>
            Host: {session?.host.first_name} {session?.host.last_name}
          </p>
        </div>

        <div className="flex flex-col">
          <LocationText
            location={session?.location ?? ""}
            link={session?.virtual_link}
          />
          <DateText date={session?.date ?? ""} />

          <CapacityText
            capacity={session?.capacity ?? 1}
            num_users={session?.users.length ?? 1}
          />
        </div>

        <div className="my-2">
          <p className="text-sm text-gray-500">{session?.description}</p>
        </div>

        {session && session.users.length > 0 && (
          <div className="w-full my-2">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                    <span>Users Signed Up</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 space-y-2">
                    {session?.users.map((user) => (
                      <RegisteredUser key={user.id} user={user} />
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        )}

        {error && (
          <div className="block text-sm m-1 font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-10 gap-2">
          {!isHosting ? (
            <LoadingButton
              type="button"
              className={`inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none ${buttonColours[0]}`}
              isLoading={isLoading}
              onClick={() => (hasJoined ? leaveSession() : joinSession())}
            >
              {hasJoined ? "Leave Session" : "Join Session"}
            </LoadingButton>
          ) : (
            <p className="col-span-8 px-4 py-2 font-medium text-center text-gray-900">
              You are hosting this session
            </p>
          )}
          <button
            type="button"
            className={`inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonColours[1]}`}
            onClick={initiateClose}
          >
            Close
          </button>
        </div>
      </div>
    </Popup>
  );
}
