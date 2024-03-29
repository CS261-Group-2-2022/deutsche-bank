import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type PopupProps = {
  isOpen: boolean;
  isClosing: boolean;
  initiateClose: () => unknown;
  closeModal: () => unknown;
  children: React.ReactNode;
  className?: string;
};

export default function Popup({
  isOpen,
  isClosing,
  closeModal,
  initiateClose,
  children,
  className,
}: PopupProps) {
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
          onClose={initiateClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-90" />

            {/* Center modal contents */}
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
              <div
                className={`inline-block w-full max-w-3xl p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${className}`}
              >
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
