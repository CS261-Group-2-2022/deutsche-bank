import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Dialog } from "@headlessui/react";
import {
  CREATE_USER_PLANS,
  getAuthToken,
  LIST_USER_PLANS,
} from "../../utils/endpoints";
import Popup from "../Popup";
import { FormTextArea } from "../FormTextarea";
import { FormInput } from "../FormInput";
import { LoadingButton } from "../LoadingButton";

type CreatePlanOfActionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
  menteeID: number;
};

export default function CreatePlanOfActionPopup({
  isOpen,
  closeModal,
  menteeID,
}: CreatePlanOfActionPopupProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [description, setDescription] = useState("");
  const [planName, setPlanName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const [planNameError, setPlanNameError] = useState<string | undefined>();
  const [dueDateError, setDueDateError] = useState<string | undefined>();

  const clearErrors = () => {
    setDescriptionError(undefined);
    setPlanNameError(undefined);
    setDueDateError(undefined);
    setError(undefined);
  };

  const createMenteesPlan = async () => {
    setIsLoading(true);
    clearErrors();

    const date = Date.parse(dueDate);
    if (date <= Date.now()) {
      setDueDateError("The date you select cannot be in the past");
      setIsLoading(false);
      return;
    }

    const res = await fetch(CREATE_USER_PLANS, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        name: planName,
        description,
        completed: false,
        due_date: dueDate,
        user: menteeID,
      }),
    });

    if (res.ok) {
      initiateClose();
      mutate(LIST_USER_PLANS.replace("{ID}", menteeID.toString()));
    } else {
      const body = await res.json();
      setPlanNameError(body.name?.join(" "));
      setDescriptionError(body.description?.join(" "));
      setDueDateError(body.due_date?.join(" "));
      setError(body.non_field_errors?.join(" "));
    }

    setIsLoading(false);
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
            createMenteesPlan();
          }}
        >
          <FormInput
            id={"planname"}
            name="Title"
            type="text"
            placeholder={"Enter the title of your Plan of Action"}
            text={planName}
            onChange={setPlanName}
            error={planNameError}
            required
          />
          <FormTextArea
            id="feedback"
            name="Description"
            autoComplete="false"
            placeholder="Enter a description of your plan of action, such as goals/objectives to accomplish and ways to do so"
            text={description}
            onChange={setDescription}
            error={descriptionError}
            required
          />
          <FormInput
            id={"dueDate"}
            name={"Due Date"}
            type={"datetime-local"}
            placeholder=""
            text={dueDate}
            onChange={setDueDate}
            error={dueDateError}
            required
          />

          {error && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-10 gap-2 pt-2">
            <LoadingButton
              type="submit"
              className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
              isLoading={isLoading}
            >
              Create Plan of Action
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
