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
import { FormTextArea } from "../FormTextarea";

/** Verifies whether a join response is succesful or not (and type guards the body) */
const isJoinSuccess = (
  res: Response,
  body: JoinSessionResponse
): body is JoinSessionSuccess => {
  return res.ok;
};

type MentorReviewPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function MentorReviewPopup({
  isOpen,
  closeModal,
}: MentorReviewPopupProps) {
  const { user } = useUser();

  const [isClosing, setIsClosing] = useState(false);
  const [review, setReview] = useState("");

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
  const [reviewError, setReviewError] = useState<string | undefined>();

  const clearErrors = () => {
    setReviewError(undefined);
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
        className="leading-6 text-gray-900 space-x-2 text-center mt-3"
      >
        <span className="text-3xl font-black text-center">
          Review your Mentor
        </span>
      </Dialog.Title>

      <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-1">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900"></h2>
          </div>

          <form
            className="mt-8 space-y-3"
            action="#"
            method="POST"
            onSubmit={(e) => {
              console.log("Submiting review...");
              e.preventDefault();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <FormTextArea
                  id="feedback"
                  name="Mentor Review"
                  autoComplete="false"
                  placeholder="Enter a review of your mentor"
                  text={review}
                  onChange={setReview}
                  error={reviewError}
                />
              </div>

              <div className="grid grid-cols-10 gap-2">
                <button
                  type="submit"
                  className="group col-span-8 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  className={`inline-flex col-span-2 justify-center col-span-2 px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-grey-100`}
                  onClick={initiateClose}
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}
    </Popup>
  );
}
