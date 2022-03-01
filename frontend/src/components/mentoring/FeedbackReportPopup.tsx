import React, { useEffect, useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { Dialog, Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
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
import { FormTextArea } from "../FormTextarea";

/** Verifies whether a join response is succesful or not (and type guards the body) */
const isJoinSuccess = (
  res: Response,
  body: JoinSessionResponse
): body is JoinSessionSuccess => {
  return res.ok;
};

type FeedbackReportPopup = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function FeedbackReportPopup({
  isOpen,
  closeModal,
}: FeedbackReportPopup) {
  const [isClosing, setIsClosing] = useState(false);
  const [goingWell, setGoingWell] = useState("");
  const [improvements, setImprovements] = useState("");

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
  const [goingWellError, setGoingWellError] = useState<string | undefined>();
  const [improvementsError, setImprovementsError] = useState<
    string | undefined
  >();

  const clearErrors = () => {
    setGoingWellError(undefined);
    setImprovementsError(undefined);
  };

  return (
    <Popup
      isOpen={isOpen}
      isClosing={isClosing}
      initiateClose={initiateClose}
      closeModal={closeModal}
    >
      <Dialog.Title
        as="h3"
        className="leading-6 text-gray-900 space-x-2 justify-center flex font-bold text-3xl my-1"
      >
        Create Feedback Report
      </Dialog.Title>

      <div className="min-h-full items-center justify-center space-y-3 w-full">
        <form
          className="space-y-1"
          onSubmit={(e) => {
            e.preventDefault();
            // createSessionRequest();
          }}
        >
          <FormTextArea
            id="well"
            name="What's going well"
            autoComplete="false"
            placeholder="Enter a description of things the mentee is doing well, such as achievements"
            text={goingWell}
            onChange={setGoingWell}
            error={goingWellError}
            required
          />

          <FormTextArea
            id="well"
            name="Areas of Improvement"
            autoComplete="false"
            placeholder="Enter a description about areas where the mentee could look to work on and improve further"
            text={improvements}
            onChange={setImprovements}
            error={improvementsError}
            required
          />

          {error && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-10 gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              className="inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              onClick={initiateClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Popup>
  );
}
