import { Dialog } from "@headlessui/react";
import { GroupSession } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "./LocationText";
import DateText from "./DateText";
import Popup from "./Popup";
import { useEffect, useState } from "react";
import CapacityText from "./CapacityText";

type SessionInfoPopupProps = {
  session?: GroupSession;
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function SessionInfoPopup({
  session,
  isOpen,
  closeModal,
}: SessionInfoPopupProps) {
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
      <Dialog.Title as="h3" className="leading-6 text-gray-900 space-x-2">
        <span className="text-3xl font-black uppercase">{session?.name}</span>{" "}
        <span className="space-x-1 text-lg">
          {session?.skills?.map((skill) => (
            <SessionTopicLabel key={skill.id} name={skill.name} />
          ))}
        </span>
      </Dialog.Title>
      <div className="my-2 flex items-center">
        <img
          alt="Session Image"
          src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
          className="h-14 rounded-lg"
        />
        <p className="ml-3">Fullname</p>
      </div>

      <div className="flex flex-col">
        <LocationText location={session?.location ?? ""} link={session?.link} />
        <DateText date={session?.date ?? ""} />

        <CapacityText
          capacity={session?.capacity ?? 1}
          num_users={session?.users.length ?? 1}
        />
      </div>

      <div className="my-2">
        <p className="text-sm text-gray-500">{session?.description}</p>
      </div>
      <div className="grid grid-cols-10 gap-2">
        <button
          type="button"
          className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
          onClick={initiateClose}
        >
          Join Session
        </button>
        <button
          type="button"
          className="inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={initiateClose}
        >
          Close
        </button>
      </div>
    </Popup>
  );
}
