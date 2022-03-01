import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Popup from "./Popup";
import { FormInput } from "./FormInput";
import { FormTextArea } from "./FormTextarea";
import {
  CREATE_MEETING_REQUEST_ENDPOINT,
  getAuthToken,
  Mentorship,
  MENTORSHIP_ENDPOINT,
} from "../utils/endpoints";
import { mutate } from "swr";
import { LoadingButton } from "./LoadingButton";

type CreateSessionPopupProps = {
  mentorship: Mentorship;
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function RequestMeetingPopup({
  mentorship,
  isOpen,
  closeModal,
}: CreateSessionPopupProps) {
  const [datetime, setDatetime] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [datetimeError, setDatetimeError] = useState<string | undefined>();
  const [meetingLocationError, setMeetingLocationError] = useState<
    string | undefined
  >();
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const [overallError, setOverallError] = useState<string | undefined>();

  const clearErrors = () => {
    setDatetimeError(undefined);
    setOverallError(undefined);
  };

  const sendMeetingRequest = async () => {
    setIsLoading(true);
    clearErrors();

    const date = Date.parse(datetime);
    if (date <= Date.now()) {
      setDatetimeError("The time you select cannot be in the past");
      setIsLoading(false);
      return;
    }

    const res = await fetch(CREATE_MEETING_REQUEST_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        mentorship: mentorship.id,
        time: datetime,
        location,
        description,
      }),
    });

    const body = await res.json();
    if (res.ok) {
      initiateClose();

      // Revalidate the cache of all meetings
      mutate(MENTORSHIP_ENDPOINT.replace("{ID}", mentorship.id.toString()));
    } else {
      setDatetimeError(body.time?.join(" "));
      setMeetingLocationError(body.location?.join(" "));
      setDescriptionError(body.description?.join(" "));
      setOverallError(body.non_field_errors?.join(" "));
    }

    setIsLoading(false);
  };

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

  return (
    <Popup
      isOpen={isOpen}
      isClosing={isClosing}
      initiateClose={initiateClose}
      closeModal={closeModal}
    >
      <Dialog.Title
        as="h1"
        className="leading-6 text-gray-900 space-x-2 justify-center flex font-bold text-2xl my-1"
      >
        Request a Meeting
      </Dialog.Title>

      <div className="min-h-full items-center justify-center space-y-3 w-full">
        {/* TODO: show conflict warning if upcoming sessions conflict */}
        <form
          className="space-y-1"
          onSubmit={(e) => {
            e.preventDefault();
            sendMeetingRequest();
          }}
        >
          <FormInput
            id="datetime"
            name="Date and Time"
            type="datetime-local"
            autoComplete="false"
            placeholder=""
            text={datetime}
            onChange={setDatetime}
            error={datetimeError}
            min={Date.now()}
            required
          />
          <FormInput
            id="location"
            type="text"
            name="Meeting Location"
            placeholder="Enter proposed meeting location"
            text={meetingLocation}
            onChange={setMeetingLocation}
            error={meetingLocationError}
            required
          />
          <FormTextArea
            id="description"
            name="Meeting Description"
            placeholder="Enter a description about the meeting, like why you want to meet and discussion points to cover"
            text={description}
            onChange={setDescription}
            error={descriptionError}
            required
          />
          {overallError && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {overallError}
            </div>
          )}
          <div className="grid grid-cols-10 gap-2 pt-2">
            <LoadingButton
              type="submit"
              className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
              onClick={() => sendMeetingRequest()}
              isLoading={isLoading}
            >
              Submit Request
            </LoadingButton>
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
