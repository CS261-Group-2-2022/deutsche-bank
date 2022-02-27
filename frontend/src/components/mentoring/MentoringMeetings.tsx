import { Disclosure } from "@headlessui/react";
import {
  CalendarIcon,
  ChevronUpIcon,
  PencilIcon,
  SaveIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { FormTextArea } from "../FormTextarea";
import RequestMeetingPopup from "../RequestAMeetingPopup";

function Meeting() {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [menteeNotes, setMenteeNotes] = useState("mentee notes");
  const [mentorNotes, setMentorNotes] = useState("mentor notes");
  const isMentor = false;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-col w-full px-4 py-2 text-lg text-left text-gray-90  bg-indigo-100 rounded-lg hover:bg-indigo-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 border border-gray-400">
            <div className="flex w-full justify-between font-bold">
              17th January 2022
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-gray-500`}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="mx-5">
            <div className="grid grid-cols-2 gap-5 w-full">
              <div className="">
                <h5 className="font-semibold text-gray-900 text-base flex">
                  Mentor Notes
                  {isMentor && (
                    <button
                      className="ml-2 flex items-center bg-green-50 rounded-lg px-2 text-black z-50 hover:bg-green-200 border border-gray-300"
                      onClick={() => setIsEditingNotes((current) => !current)}
                    >
                      {isEditingNotes ? (
                        <>
                          {/* <SaveIcon className="w-5 h-5 mr-1" /> */}
                          Save
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-5 h-5 mr-1" />
                          Edit
                        </>
                      )}
                    </button>
                  )}
                </h5>
                {isEditingNotes ? (
                  <FormTextArea
                    id="notes"
                    name=""
                    placeholder="Enter your notes for this session"
                    text={mentorNotes}
                    onChange={setMentorNotes}
                  />
                ) : (
                  <p className="text-sm text-gray-800">{mentorNotes}</p>
                )}
              </div>
              <div className="">
                <h5 className="font-semibold text-gray-900 text-base flex">
                  Mentee Notes
                  {!isMentor && (
                    <button
                      className="ml-2 flex items-center bg-green-50 rounded-lg px-2 text-black z-50 hover:bg-green-200 border border-gray-300"
                      onClick={() => setIsEditingNotes((current) => !current)}
                    >
                      {isEditingNotes ? (
                        <>
                          {/* <SaveIcon className="w-5 h-5 mr-1" /> */}
                          Save
                        </>
                      ) : (
                        <>
                          <PencilIcon className="w-5 h-5 mr-1" />
                          Edit
                        </>
                      )}
                    </button>
                  )}
                </h5>
                {isEditingNotes ? (
                  <FormTextArea
                    id="notes"
                    name=""
                    placeholder="Enter your notes for this session"
                    text={menteeNotes}
                    onChange={setMenteeNotes}
                  />
                ) : (
                  <p className="text-sm text-gray-800">{menteeNotes}</p>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default function MentoringMeetings() {
  const meetings: string[] = ["a", "b", "c"];

  const [isRequestingMeeting, setIsRequestingMeeting] = useState(false);

  return (
    <>
      {/* TODO: past present future meetings */}
      {/* TODO: request new meeting */}
      <RequestMeetingPopup
        isOpen={isRequestingMeeting}
        closeModal={() => setIsRequestingMeeting(false)}
      />
      <button
        onClick={() => setIsRequestingMeeting(true)}
        className="my-3 py-2 px-10 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
      >
        <CalendarIcon className="w-5 h-5 mr-2" />
        Request a meeting
      </button>
      <div className="flex flex-col gap-2">
        {meetings.map((meeting) => (
          <Meeting key={meeting} />
        ))}
      </div>
    </>
  );
}
