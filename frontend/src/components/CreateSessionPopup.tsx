import { Dialog } from "@headlessui/react";
import {
  CREATE_GROUP_SESSION_ENDPOINT,
  GroupSession,
} from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "../components/LocationText";
import DateText from "../components/DateText";
import Popup from "./Popup";
import { FormInput } from "./FormInput";
import FormDropdown from "./FormDropdown";
import { useEffect, useState } from "react";
import { useUser } from "../utils/authentication";
import { useBusinessAreas } from "../utils/business_area";
import { LIST_GROUP_SESSIONS_ENDPOINT, BusinessArea } from "../utils/endpoints";
import { mutate } from "swr";

type CreateSessionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function CreateSessionPopup({
  isOpen,
  closeModal,
}: CreateSessionPopupProps) {
  const { user } = useUser();
  const { areas } = useBusinessAreas();
  // const {skills} = useSkills();

  const [sessionTitle, setSessionTitle] = useState("");
  const [location, setLocation] = useState("");
  const [virtualLink, setVirtualLink] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [datetime, setDatetime] = useState("");
  const [businessArea, setBusinessArea] = useState<BusinessArea | undefined>(
    areas[0]
  ); //TODO change this to skills and extra users instead of this

  const [sessionTitleError, setSessionTitleError] = useState<
    string | undefined
  >();
  const [locationError, setLocationError] = useState<string | undefined>();
  const [virtualLinkError, setVirtualLinkError] = useState<
    string | undefined
  >();
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const [capacityError, setCapacityError] = useState<string | undefined>();
  const [datetimeError, setDatetimeError] = useState<string | undefined>();
  const [businessAreaError, setBusinessAreaError] = useState<
    string | undefined
  >();

  const clearErrors = () => {
    setSessionTitleError(undefined);
    setLocationError(undefined);
    setVirtualLinkError(undefined);
    setDescriptionError(undefined);
    setCapacityError(undefined);
    setDatetimeError(undefined);
    setBusinessAreaError(undefined);
  };

  const createSessionRequest = async () => {
    // TODO: check response
    await fetch(CREATE_GROUP_SESSION_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: sessionTitle,
        location,
        description,
        capacity,
        date: datetime,
        // host: 1,
        skills: [2, 3, 4],
        // users: [2, 4, 5],
      }),
    });

    clearErrors();
    initiateClose();
    mutate(LIST_GROUP_SESSIONS_ENDPOINT);
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
        as="h3"
        className="leading-6 text-gray-900 space-x-2"
      ></Dialog.Title>

      <div className="min-h-full items-center justify-center space-y-3 w-full">
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            createSessionRequest();
          }}
        >
          <span className="justify-center flex font-bold text-3xl">
            Create Session
          </span>

          <input type="hidden" name="remember" defaultValue="true" />
          <FormInput
            id="sessiontitle"
            name="Session Title"
            type="text"
            autoComplete="false"
            placeholder="Session Title"
            text={sessionTitle}
            onChange={setSessionTitle}
            error={sessionTitleError}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="location"
              name="Location"
              type="text"
              autoComplete="false"
              placeholder="Location"
              text={location}
              onChange={setLocation}
              error={locationError}
              required
            />
            <FormInput
              id="virtuallink"
              name="Virtual Link"
              type="url"
              autoComplete="false"
              placeholder="Link to Online Session"
              text={virtualLink}
              onChange={setVirtualLink}
              error={virtualLinkError}
            />
          </div>

          <FormInput
            id="description"
            name="Group Session Description"
            type="text"
            autoComplete="false"
            placeholder="Group Session Description"
            text={description}
            onChange={setDescription}
            error={descriptionError}
          />
          <hr></hr>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              id="capacity"
              name="Capacity"
              type="number"
              autoComplete="false"
              placeholder="Max Capacity"
              text={capacity}
              onChange={setCapacity}
              error={capacityError}
              min={1}
            />

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
            {/* <FormDropdown
                title=""
                options={areas}
                selected={businessArea}
                setSelected={setBusinessArea}
                error={businessAreaError}
                placeholder="Select an area"
              /> */}
          </div>
          <div className="grid grid-cols-10 gap-2">
            <button
              type="submit"
              className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
            >
              Create Session
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
