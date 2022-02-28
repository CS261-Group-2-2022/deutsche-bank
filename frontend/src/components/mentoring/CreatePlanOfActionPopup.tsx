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
import { FormInput } from "../FormInput";

/** Verifies whether a join response is succesful or not (and type guards the body) */
const isJoinSuccess = (
  res: Response,
  body: JoinSessionResponse
): body is JoinSessionSuccess => {
  return res.ok;
};

type CreatePlanOfActionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
  menteeID: number;
};

export default function CreatePlanOfActionPopup({
  isOpen,
  closeModal,
}: CreatePlanOfActionPopupProps) {
  const { user } = useUser();

  const [isClosing, setIsClosing] = useState(false);
  const [description, setDescription] = useState("");
  const [planName, setPlanName] = useState("");
  const [completionDate, setCompletionDate] = useState("");

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
  const [descriptionError, setDescriptionError] = useState<string | undefined>();
  const [planNameError, setPlanNameError] = useState<string | undefined>();
  const [completionDateError, setCompletionDateError] = useState<string | undefined>();

  const clearErrors = () => {
    setDescriptionError(undefined);
    setPlanNameError(undefined);
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
        Create a Plan of Action
      </Dialog.Title>

      <div className="min-h-full items-center justify-center space-y-3 w-full">
        <form
          className="space-y-1"
          onSubmit={(e) => {
            e.preventDefault();
            // createSessionRequest();
          }}
        >
          {/* TODO: Star rating */}
          <FormInput id={"planname"} name={"Name of Plan of Action"} type={"text"} placeholder={"Enter the name of your Plan of Action"} text={planName} onChange={setPlanName} />
          <FormTextArea
            id="feedback"
            name="Plan of Action Description"
            autoComplete="false"
            placeholder="Enter a description of your plan of action"
            text={description}
            onChange={setDescription}
            error={descriptionError}
          />
          <div className="grid grid-cols-2 gap-2 pt-2">
              <FormInput id={"completion_date"} name={"Date you completed the plan of action"} type={"datetime-local"} placeholder={""} text={completionDate} onChange={setCompletionDate} />
          </div>

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
              Create Plan of Action
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
