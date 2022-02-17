import { Dialog } from "@headlessui/react";
import { GroupSession } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import LocationText from "../components/LocationText";
import DateText from "../components/DateText";
import Popup from "./Popup";

type CreateSessionPopupProps = {
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function CreateSessionPopup({
  isOpen,
  closeModal,
}: CreateSessionPopupProps) {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={closeModal}
      successButtonText="Join Session"
    >
      <Dialog.Title
        as="h3"
        className="leading-6 text-gray-900 space-x-2"
      ></Dialog.Title>
    </Popup>
  );
}
