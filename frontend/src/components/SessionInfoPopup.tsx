import { Dialog } from "@headlessui/react";
import { GroupSession } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "./LocationText";
import DateText from "./DateText";
import Popup from "./Popup";

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
  return (
    <Popup
      isOpen={isOpen}
      closeModal={closeModal}
      successButtonText="Join Session"
    >
      <Dialog.Title as="h3" className="leading-6 text-gray-900 space-x-2">
        <span className="text-3xl font-black uppercase">{session?.name}</span>{" "}
        <span className="space-x-1 text-lg">
          {session?.skills?.map((skill) => (
            <SessionTopicLabel key={skill} name={skill} />
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
      <LocationText location={session?.location ?? ""} />
      <DateText date={session?.date ?? ""} />
      <div className="my-2">
        <p className="text-sm text-gray-500">{session?.description}</p>
      </div>
    </Popup>
  );
}
