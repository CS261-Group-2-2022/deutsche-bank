import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Popup from "./Popup";
import { FormInput } from "./FormInput";

type CreateSessionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function RequestMeetingPopup({
  isOpen,
  closeModal,
}: CreateSessionPopupProps) {
  const [datetime, setDatetime] = useState("");

  const [datetimeError, setDatetimeError] = useState<string | undefined>();
  const [overallError, setOverallError] = useState<string | undefined>();

  const clearErrors = () => {
    setDatetimeError(undefined);
    setOverallError(undefined);
  };

  const sendMeetingRequest = async () => {
    const date = Date.parse(datetime);
    if (date <= Date.now()) {
      setDatetimeError("The time you select cannot be in the past");
      return;
    }

    // const res = await fetch(CREATE_GROUP_SESSION_ENDPOINT, {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //     authorization: `Token ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify({
    //     name: sessionTitle,
    //     location,
    //     description,
    //     capacity,
    //     date: datetime,
    //     skills: assignedSkills.map((skill) => skill.id), // TODO: only use permitted skills? (ones they are expert in)
    //     virtual_link: virtualLink,
    //   }),
    // });

    // // Clear any existing errors
    clearErrors();
    // const body: CreateSessionResponse = await res.json();

    // if (
    //   isResponseSuccess<CreateSessionSuccess, CreateSessionResponse>(res, body)
    // ) {
    //   // Close the modal
    //   initiateClose();

    //   // TODO: mutate upcoming sesssions
    // } else {
    //   // TODO: get server output
    //   setDatetimeError(body.date?.join(" "));
    //   setOverallError(body.non_field_errors?.join(" "));
    // }
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
          {overallError && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {overallError}
            </div>
          )}
          <div className="grid grid-cols-10 gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
            >
              Submit Request
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
