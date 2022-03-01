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

type StarProps = {
  value: number;
  hoverRating: number;
  currentRating: number;
  setHoveringRating: (value: number) => unknown;
  setRating: (value: number) => unknown;
};

const Star = ({
  currentRating,
  value,
  hoverRating,
  setRating,
  setHoveringRating,
}: StarProps) => {
  return (
    <button
      onClick={() => setRating(value)}
      onMouseOver={() => setHoveringRating(value)}
      onMouseLeave={() => setHoveringRating(currentRating)}
      aria-hidden="true"
      title={`${value} star`}
      className={`rounded-sm fill-current focus:outline-none focus:shadow-outline p-1 w-12 m-0 cursor-pointer transition-colors duration-75 ${
        currentRating >= value && hoverRating >= value
          ? "text-yellow-400"
          : hoverRating >= value
          ? "text-gray-600"
          : "text-gray-400"
      }`}
    >
      <StarIcon />
    </button>
  );
};

type StarRatingProps = {
  currentRating: number;
  setCurrentRating: React.Dispatch<React.SetStateAction<number>>;
};

const StarRating = ({ currentRating, setCurrentRating }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center space-x-0">
      {[...Array(5)].map((_, value) => (
        <Star
          key={value}
          value={value + 1}
          hoverRating={hoverRating}
          currentRating={currentRating}
          setHoveringRating={setHoverRating}
          setRating={(value) =>
            setCurrentRating((current) => (current === value ? 0 : value))
          }
        />
      ))}
    </div>
  );
};

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
  const [currentRating, setCurrentRating] = useState(0);
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
        className="leading-6 text-gray-900 space-x-2 justify-center flex font-bold text-3xl my-1"
      >
        Review your Mentor
      </Dialog.Title>

      <div className="min-h-full items-center justify-center space-y-3 w-full">
        <form
          className="space-y-1"
          onSubmit={(e) => {
            e.preventDefault();
            // createSessionRequest();
          }}
        >
          <div>
            <h4 className="flex text-sm font-medium text-gray-700">
              Enter an overall rating
              <p className="text-red-500 pl-1">*</p>
            </h4>
            <StarRating
              currentRating={currentRating}
              setCurrentRating={setCurrentRating}
            />
          </div>

          <FormTextArea
            id="feedback"
            name="Mentor Review"
            autoComplete="false"
            placeholder="Enter a review of your mentor"
            text={review}
            onChange={setReview}
            error={reviewError}
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
              Submit Review
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
