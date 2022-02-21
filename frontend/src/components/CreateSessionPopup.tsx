import { Dialog } from "@headlessui/react";
import { GroupSession } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "../components/LocationText";
import DateText from "../components/DateText";
import Popup from "./Popup";
import { FormInput } from "./FormInput";
import { useEffect, useState } from "react";
import { Console } from "console";

type CreateSessionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function CreateSessionPopup({
  isOpen,
  closeModal,
}: CreateSessionPopupProps) {

  const [sessionTitle, setSessionTitle] = useState("");
  const [location, setLocation] = useState("");
  const [virtualLink, setVirtualLink] = useState("");


  const [sessionTitleError, setSessionTitleError] = useState<string | undefined>();
  const [locationError, setLocationError] = useState<string | undefined>(); 
  const [virtualLinkError, setVirtualLinkError] = useState<string | undefined>(); 

  const createSessionRequest = async () => {
    console.log(sessionTitle);
  };


  return (
    <Popup
      isOpen={isOpen}
      closeModal={closeModal}
      successButtonText="Create Session"
    >
      <Dialog.Title
        as="h3"
        className="leading-6 text-gray-900 space-x-2"
      ></Dialog.Title>

<div className="min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 space-y-3 {/*max-w-md*/} w-full">
      <label htmlFor="inputid1" className="sr-only">
        placeholder
      </label>

      <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              createSessionRequest();
            }}
          >

            <span className="justify-center flex font-bold text-3xl">Create Session</span>

      <input
        type="hidden" name="remember" defaultValue="true"
      />
      <FormInput 
        id="sessiontitle"
        name="Session Title"
        type="text"
        autoComplete="false"
        placeholder="Session Title"
        text={sessionTitle}
        onChange={setSessionTitle}
        error={sessionTitleError}
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

            
        <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Session
              </button>
              <button
                    type="button"
                    className="inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  >Close</button>
      </form>
    </div>

    </Popup>
  );
}
