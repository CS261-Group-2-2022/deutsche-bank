import SessionTopicLabel from "../SessionTopicLabel";
import {
  FULL_USER_ENDPOINT,
  PROFILE_ENDPOINT,
  SETTINGS_ENDPOINT,
  Skill,
  User,
  UserFull,
} from "../../utils/endpoints";
import {
  ChevronUpIcon,
  ExclamationIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/react/solid";
import React, { Fragment, useRef, useState } from "react";
import { FormTextArea } from "../FormTextarea";
import { Transition, Dialog, Disclosure } from "@headlessui/react";
import { FormInput } from "../FormInput";
import { getSkillFromId, useSkills } from "../../utils/skills";
import SkillsFuzzyList from "../SkillsFuzzyList";
import MentorReviewPopup from "./MentorReviewPopup";
import { mutate } from "swr";
import AreasOfInterest from "./AreasOfInterest";
import { DateTime } from "luxon";
import FeedbackReportPopup from "./FeedbackReportPopup";
import InterestsDescription from "./InterestsDescription";

type TerminateRelationshipPromptProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TerminateRelationshipPrompt = ({
  open,
  setOpen,
}: TerminateRelationshipPromptProps) => {
  const cancelButtonRef = useRef(null);

  // TODO: connect to backend
  const [password, setPassword] = useState("");

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      End Relationship
                    </Dialog.Title>
                    <div className="my-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you wish to end your mentoring
                        relationship? This action cannot be undone.
                      </p>
                    </div>
                    <FormInput
                      id="password"
                      type="password"
                      name="Enter your password to confirm"
                      placeholder="Enter password"
                      text={password}
                      onChange={setPassword}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    password === "" ? "opacity-25 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Terminate
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

type MentorProfileProps = {
  mentor: UserFull;
  perspective: "mentor" | "mentee";
  setMentorReviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MentorProfile = ({
  mentor,
  perspective,
  setMentorReviewOpen,
}: MentorProfileProps) => {
  const [terminatePromptOpen, setTerminatePromptOpen] = useState(false);

  return (
    <div className="w-full max-h-min border rounded-2xl border-gray-300 p-2">
      <TerminateRelationshipPrompt
        open={terminatePromptOpen}
        setOpen={setTerminatePromptOpen}
      />
      <h3 className="text-xl font-bold">Current Mentor</h3>

      <div className="flex justify-between items-center p-2">
        <div>
          <div className="flex items-center space-x-4">
            <img
              alt="Profile Picture"
              src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
              className="h-20 rounded-lg"
            />

            <div className="flex-auto flex-col gap-1">
              <h1 className="font-bold text-xl">
                {mentor.first_name} {mentor.last_name}
                <span className="ml-1 text-base font-normal text-gray-700">
                  (
                  <a
                    href={`mailto:${mentor.email}`}
                    className="hover:text-blue-600 transition-colors duration-75"
                  >
                    {mentor.email}
                  </a>
                  )
                </span>
              </h1>
              <div className="text-m text-gray-500">
                {mentor.business_area.name ?? ""}
              </div>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.length > 0
                  ? mentor.expertise.map((skill) => (
                      <SessionTopicLabel key={skill.id} name={skill.name} />
                    ))
                  : "No expertise"}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* TODO connect up to backend */}
          {perspective === "mentee" && (
            <button
              className="ml-2 px-4 py-2 flex items-center bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 focus:ring-offset-yellow-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              onClick={() => setMentorReviewOpen(true)}
            >
              <PencilIcon className="w-5 h-5 mr-1" />
              Give Review
            </button>
          )}
          <button
            onClick={() => setTerminatePromptOpen(true)}
            className="ml-2 px-4 py-2 flex items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <XIcon className="w-5 h-5 mr-1" />
            End Relationship
          </button>
        </div>
      </div>
    </div>
  );
};

type FeedbackDropdownProps = {
  feedback: {
    time: string;
    going_well?: string;
    improvement?: string;
  };
};

const FeedbackDropdown = ({ feedback }: FeedbackDropdownProps) => {
  // const [isEditingNotes, setIsEditingNotes] = useState(false);
  // const [menteeNotes, setMenteeNotes] = useState(meeting.mentee_notes ?? "");
  // const [mentorNotes, setMentorNotes] = useState(meeting.mentor_notes ?? "");
  // const isMentor = perspective === "mentor";

  const datetime = DateTime.fromISO(feedback.time);
  // const notesNotRecorded =
  // (isMentor && mentorNotes === "") || (!isMentor && menteeNotes === "");

  // TODO: connect updating to backend

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-md font-bold text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 border border-gray-400">
            <div className="flex w-full justify-between font-bold items-center">
              <div className="flex">{datetime.toFormat("DDDD, t ZZZZ")}</div>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-gray-900`}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className="flex flex-col mx-5 my-1">
            <div className="grid grid-cols-2 gap-5 w-full">
              <div>
                <h5 className="font-semibold text-gray-900 text-base flex mb-2">
                  What{"'"}s going well
                </h5>
                <p className="text-sm text-gray-800">
                  {!feedback.going_well || feedback.going_well === ""
                    ? "N/A"
                    : feedback.going_well}
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 text-base flex mb-2">
                  Areas of Improvement
                </h5>

                <p className="text-sm text-gray-800">
                  {!feedback.improvement || feedback.improvement === ""
                    ? "N/A"
                    : feedback.improvement}
                </p>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

type MenteeFeedbackProps = {
  perspective: "mentor" | "mentee";
};

const MenteeFeedback = ({ perspective }: MenteeFeedbackProps) => {
  const [createOpen, setCreateOpen] = useState(false);

  const feedback = [
    // { time: new Date(Date.now()).toISOString() },
    // { time: new Date(Date.now()).toISOString() },
    // { time: new Date(Date.now()).toISOString() },
    // { time: new Date(Date.now()).toISOString() },
    // { time: new Date(Date.now()).toISOString() },
    { time: new Date(Date.now()).toISOString() },
  ];

  return (
    <div className="w-full">
      <FeedbackReportPopup
        isOpen={createOpen}
        closeModal={() => setCreateOpen(false)}
      />
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold">Feedback Reports</h3>
          <h4 className="text-gray-600 text-sm">
            These are general feedback reports provided by the mentor to
            highlight the mentee{"'"}s progress.
          </h4>
        </div>
        <div>
          {perspective === "mentor" && (
            <button
              className="ml-2 mr-4 px-4 py-2 flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Report
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        {feedback.length > 0
          ? feedback.map((feedback) => (
              <FeedbackDropdown key={feedback.time} feedback={feedback} />
            ))
          : "No feedback has been provided yet"}
      </div>
    </div>
  );
};

type BusinessAreaConflictWarning = {
  perspective: "mentor" | "mentee";
};

const BusinessAreaConflictWarning = ({
  perspective,
}: BusinessAreaConflictWarning) => {
  return (
    <div className="w-full bg-orange-200 rounded-lg p-2 border border-orange-400">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-200 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationIcon
            className="h-6 w-6 text-orange-700"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 text-left">
          <h3 className="text-lg leading-6 font-medium text-orange-800">
            Business Area Conflict
          </h3>
          <div className="my-1">
            <p className="text-base text-orange-700">
              You and your {perspective === "mentor" ? "mentee" : "mentor"} are
              both now part of the same business area, which violates the rules
              of mentoring. You should discuss this with your{" "}
              {perspective === "mentor" ? "mentee" : "mentor"} and change the
              relationship if necessary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type GeneralInfoProps = {
  mentee: User;
  mentor: UserFull;
  perspective: "mentor" | "mentee";
};

export default function GeneralInfo({
  mentor,
  mentee,
  perspective,
}: GeneralInfoProps) {
  const [mentorReviewOpen, setMentorReviewOpen] = useState(false);
  const businessAreaConflict = mentee.business_area === mentor.business_area.id;

  return (
    <div className="mx-5 space-y-5">
      <MentorReviewPopup
        isOpen={mentorReviewOpen}
        closeModal={() => setMentorReviewOpen(false)}
      />

      {businessAreaConflict && (
        <BusinessAreaConflictWarning perspective={perspective} />
      )}

      <InterestsDescription user={mentee} canEdit={perspective === "mentee"} />
      <AreasOfInterest user={mentee} canEdit={perspective === "mentee"} />

      {/* TODO: mentee giving mentor feedback popup */}
      {/* TODO: mentor giving mentee feedback popup */}

      {/* TODO: mentor can also give feedback to mentee */}
      <div className="flex flex-col gap-5">
        <MentorProfile
          mentor={mentor}
          perspective={perspective}
          setMentorReviewOpen={setMentorReviewOpen}
        />
        <MenteeFeedback perspective={perspective} />
      </div>
    </div>
  );
}
