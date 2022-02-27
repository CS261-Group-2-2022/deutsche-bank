import { useEffect, useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import {
  getAuthToken,
  GroupSession,
  JoinSessionResponse,
  JoinSessionSuccess,
  User,
} from "../../utils/endpoints";
import { useUser } from "../../utils/authentication";
import SessionTopicLabel from "../SessionTopicLabel";
import LocationText from "../LocationText";
import DateText from "../DateText";
import Popup from "../Popup";
import CapacityText from "../CapacityText";
import { PlanOfAction } from "../../utils/endpoints";

/** Verifies whether a join response is succesful or not (and type guards the body) */
const isJoinSuccess = (
  res: Response,
  body: JoinSessionResponse
): body is JoinSessionSuccess => {
  return res.ok;
};

type PlanOfActionPopupProps = {
  planOfAction?: PlanOfAction;
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function PlanOfActionPopup({
  planOfAction,
  isOpen,
  closeModal,
}: PlanOfActionPopupProps) {
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

  const [error, setError] = useState<string | undefined>(undefined);

  //   const joinSession = async () => {
  //     try {
  //       const res = await fetch(
  //         JOIN_SESSION_ENDPOINT.replace("{ID}", session?.id.toString() ?? ""),
  //         {
  //           method: "POST",
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Token ${getAuthToken()}`,
  //           },
  //         }
  //       );

  //       // Clear existing errors
  //       setError(undefined);
  //       const body: JoinSessionResponse = await res.json();

  //       if (isJoinSuccess(res, body)) {
  //         // Update the list of available group sessions
  //         mutate(LIST_GROUP_SESSIONS_ENDPOINT);
  //         mutate(LIST_USER_JOINED_SESSIONS_ENDPOINT);
  //       } else {
  //         setError(body.error ?? "An error occurred");
  //       }
  //     } catch (err) {
  //       setError("An error occurered");
  //     }
  //   };

  //   const leaveSession = async () => {
  //     try {
  //       const res = await fetch(
  //         LEAVE_SESSION_ENDPOINT.replace("{ID}", session?.id.toString() ?? ""),
  //         {
  //           method: "POST",
  //           headers: {
  //             "content-type": "application/json",
  //             authorization: `Token ${getAuthToken()}`,
  //           },
  //         }
  //       );
  //       setError(undefined);
  //       const body: JoinSessionResponse = await res.json();

  //       if (isJoinSuccess(res, body)) {
  //         Update the list of available group sessions
  //         mutate(LIST_GROUP_SESSIONS_ENDPOINT);
  //         mutate(LIST_USER_JOINED_SESSIONS_ENDPOINT);
  //       } else {
  //         setError(body.error ?? "An error occurred");
  //       }
  //     } catch (err) {
  //       setError("An error occurered");
  //     }
  //   };

  return (
    <Popup
      isOpen={isOpen}
      isClosing={isClosing}
      initiateClose={initiateClose}
      closeModal={closeModal}
    >
      <Dialog.Title as="h3" className="leading-6 text-gray-900 space-x-2">
        <span className="text-3xl font-black uppercase">
          {planOfAction?.name}
        </span>{" "}
      </Dialog.Title>
      <div className="flex flex-row gap-2">
        Due in: <DateText date={"2025-04-11T14:46:00Z"} />
      </div>

      <div className="my-2">
        <p className="text-sm text-gray-500">{planOfAction?.description}</p>
      </div>

      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          className={`inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-grey-100`}
          onClick={initiateClose}
        >
          Close
        </button>
      </div>
    </Popup>
  );
}
