import { Tab } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { UserFull, User } from "../../utils/endpoints";
import MentoringMeetings from "./MentoringMeetings";
import MentorProfile from "./MentorInfo";

type UserProfileProps = {
  mentee: User;
  mentor: UserFull;
  perspective: "mentor" | "mentee";
};

export default function MentoringUserProfile({
  mentee,
  mentor,
  perspective,
}: UserProfileProps) {
  return (
    <div className="mx-5">
      <div className="grid grid-cols-10">
        {perspective === "mentor" && (
          <Link
            to="/mentoring/mentees"
            className="text-blue-600 hover:text-blue-900 flex items-center mb-2 col-span-2"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to your Mentees
          </Link>
        )}

        <h1 className="text-xl font-bold text-center col-span-6">
          {perspective === "mentee"
            ? "Your Profile"
            : `${mentee.first_name} ${mentee.last_name}'s Profile`}
        </h1>

        <div className="col-span-2"></div>
      </div>

      <Tab.Group>
        <Tab.List className="flex flex-wrap -mb-px justify-center gap-10 border-b border-gray-200">
          <Tab
            key="info"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Your Mentor
          </Tab>
          <Tab
            key="meetings"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Meetings
          </Tab>
          <Tab
            key="plans"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Plans of Action
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel key="info" className="mt-8">
            <div className="grid grid-cols-4 mx-5 gap-5">
              <div className="col-span-3 space-y-5">
                <MentorProfile mentor={mentor} />
              </div>
            </div>
            {/* Your Mentor */}
            {/* TODO: current mentor */}
            {/* TODO: give feedback, terminate relationship */}
          </Tab.Panel>
          <Tab.Panel key="meetings">
            <MentoringMeetings />
          </Tab.Panel>
          <Tab.Panel key="plans">PLANS OF ACTION</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
