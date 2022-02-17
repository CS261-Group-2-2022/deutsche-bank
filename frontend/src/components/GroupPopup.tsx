import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { GroupSession } from "../utils/endpoints";
import SessionTopicLabel from "./SessionTopicLabel";
import RoundedImage from "../components/RoundedImage";
import LocationText from "../components/LocationText";
import DateText from "../components/DateText";

type GroupPopupProps = {
  session?: GroupSession;
  isOpen: boolean;
  closeModal: () => unknown;
};

export default function GroupPopup({
  session,
  isOpen,
  closeModal,
}: GroupPopupProps) {
  const [isClosing, setIsClosing] = useState(false);

  // When we want to start closing the modal, we want to let the animation
  // start hiding the modal BEFORE we clear the session. Once the animation
  // has complete. we will then call `closeModal()` officially.
  const tempCloseModal = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    setIsClosing(false);
  }, [isOpen]);

  return (
    <>
      <Transition
        appear
        show={isOpen && !isClosing}
        as={Fragment}
        afterLeave={closeModal}
      >
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={tempCloseModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-50"
              leave="ease-in duration-200"
              leaveFrom="opacity-50"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-700" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="leading-6 text-gray-900 space-x-2"
                >
                  <span className="text-3xl font-black uppercase">
                    {session?.name}
                  </span>{" "}
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
                  <p className="text-sm text-gray-500">
                    {session?.description}
                  </p>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center col-span-8 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md hover:bg-blue-800 focus:outline-none"
                    onClick={tempCloseModal}
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center col-span-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={tempCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
