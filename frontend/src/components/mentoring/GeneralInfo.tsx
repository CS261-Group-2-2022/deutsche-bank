import SessionTopicLabel from "../SessionTopicLabel";
import { User, UserFull } from "../../utils/endpoints";
import { ExclamationIcon, PencilIcon, XIcon } from "@heroicons/react/solid";
import React, { Fragment, useRef, useState } from "react";
import { FormTextArea } from "../FormTextarea";
import { Transition, Dialog } from "@headlessui/react";
import { FormInput } from "../FormInput";
import { getSkillFromId, useSkills } from "../../utils/skills";
import SkillsFuzzyList from "../SkillsFuzzyList";
import MentorReviewPopup from "./MentorReviewPopup";

type PersonalBioProps = {
  mentee: User;
  perspective: "mentor" | "mentee";
};

const PersonalBio = ({ mentee, perspective }: PersonalBioProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(mentee.bio ?? "");
  const canEdit = perspective === "mentee";

  // TODO: connect update to backend
  return (
    <div className="space-y-1">
      <h3 className="flex text-xl font-bold gap-2">
        Personal Bio
        {canEdit && (
          <button
            className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? (
              <>Save</>
            ) : (
              <>
                <PencilIcon className="w-5 h-5 mr-1" />
                Edit
              </>
            )}
          </button>
        )}
      </h3>

      {canEdit && isEditing ? (
        <FormTextArea
          id="notes"
          name=""
          placeholder="Enter a description about yourself. This will be used to advise your mentoring pairings."
          text={bio}
          onChange={setBio}
        />
      ) : (
        <p className="text-gray-800">
          {bio === "" ? "No personal bio set" : bio}
        </p>
      )}
    </div>
  );
};

type AreasOfInterestProps = {
  mentee: User;
  perspective: "mentor" | "mentee";
};

const AreasOfInterest = ({ mentee, perspective }: AreasOfInterestProps) => {
  const { skills } = useSkills();

  // TODO: fuzzy list to edit/create areas of interest
  const [isEditing, setIsEditing] = useState(false);
  //   const [bio, setBio] = useState(mentee.bio ?? "");
  const canEdit = perspective === "mentee";

  // TODO: connect update to backend
  return (
    <div className="space-y-1">
      <h3 className="flex text-xl font-bold gap-2">
        Areas of Interest
        {canEdit && (
          <button
            className="ml-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? (
              <>Save</>
            ) : (
              <>
                <PencilIcon className="w-5 h-5 mr-1" />
                Edit
              </>
            )}
          </button>
        )}
      </h3>

      {canEdit && isEditing ? (
        <SkillsFuzzyList />
      ) : (
        <p className="text-gray-800">
          {mentee.interests.length > 0
            ? mentee.interests
                .map((id) => getSkillFromId(id, skills))
                .map(
                  (interest) =>
                    interest && (
                      <SessionTopicLabel
                        key={interest.id}
                        name={interest.name}
                      />
                    )
                )
            : "No current interests"}
        </p>
      )}
    </div>
  );
};

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
    <div className="w-full border rounded-2xl border-gray-300 p-2">
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
              <div className="flex flex-wrap space-x-1 space-y-1">
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

const MenteeFeedback = () => {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold">Feedback Reports</h3>
      {/* TODO: give feedback button for mentor */}

      <div>REPORT ONE</div>
      {/* TODO: Report disclosures */}
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

      <PersonalBio mentee={mentee} perspective={perspective} />
      <AreasOfInterest mentee={mentee} perspective={perspective} />

      {/* TODO: mentee giving mentor feedback popup */}
      {/* TODO: mentor giving mentee feedback popup */}

      {/* TODO: mentor can also give feedback to mentee */}
      <div className="grid grid-cols-2 gap-5">
        <MentorProfile
          mentor={mentor}
          perspective={perspective}
          setMentorReviewOpen={setMentorReviewOpen}
        />
        <MenteeFeedback />
      </div>
    </div>
  );
}
