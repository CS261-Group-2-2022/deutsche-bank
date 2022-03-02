import { useEffect, useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import {
  CHANGE_USER_PLANS,
  CREATE_USER_PLANS,
  getAuthToken,
  GroupSession,
  JoinSessionResponse,
  JoinSessionSuccess,
  LIST_USER_PLANS,
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

  const completePlanOfAction = async () => {
    const res = await fetch(
      CHANGE_USER_PLANS.replace("{ID}", planOfAction?.id.toString() ?? "-1"),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({
          completed: true,
          completion_date: new Date().toISOString(),
        }),
      }
    );

    if (res.ok) {
      mutate(
        LIST_USER_PLANS.replace("{ID}", planOfAction?.user.toString() ?? "-1")
      );
    }
  };

  const uncompletePlanOfAction = async () => {
    const res = await fetch(
      CHANGE_USER_PLANS.replace("{ID}", planOfAction?.id.toString() ?? "-1"),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({
          completed: false,
          completion_date: null,
        }),
      }
    );

    if (res.ok) {
      mutate(
        LIST_USER_PLANS.replace("{ID}", planOfAction?.user.toString() ?? "-1")
      );
    }
  };

  useEffect(() => {
    setIsClosing(false);
  }, [isOpen]);

  const [error, setError] = useState<string | undefined>(undefined);

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
        Due in: <DateText date={planOfAction?.due_date.toString() ?? ""} />
        {planOfAction?.completed ? (
          <>
            <span>Completed: </span>
            <DateText date={planOfAction?.completion_date?.toString() ?? ""} />
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="my-2">
        <p className="text-sm text-gray-500">{planOfAction?.description}</p>
      </div>

      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}

      {planOfAction?.completed ? (
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            className={
              "col-span-3 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white font-semibold rounded-md"
            }
            onClick={uncompletePlanOfAction}
          >
            Mark as incomplete
          </button>
          <button
            type="button"
            className={`inline-flex justify-center col-span-1 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500`}
            onClick={initiateClose}
          >
            Close
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            className={
              "col-span-3 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white font-semibold rounded-md"
            }
            onClick={completePlanOfAction}
          >
            Mark as complete
          </button>
          <button
            type="button"
            className={`inline-flex justify-center col-span-1 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500`}
            onClick={initiateClose}
          >
            Close
          </button>
        </div>
      )}
    </Popup>
  );
}
