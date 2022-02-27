import { Tab } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { Link, useSearchParams } from "react-router-dom";
import { UserFull, User } from "../../utils/endpoints";
import MentoringMeetings from "./MentoringMeetings";
import { useEffect, useState } from "react";
import GeneralInfo from "./GeneralInfo";
import PlansOfAction from "./PlansOfAction";

type UserProfileProps = {
  mentee: User;
  mentor: UserFull;
  perspective: "mentor" | "mentee";
};

const tabIndexToString = (index: number) => {
  if (index === 1) {
    return "meetings";
  } else if (index === 2) {
    return "plans";
  } else {
    return "info";
  }
};

const tabStringToIndex = (str: string | null) => {
  if (!str) return 0;

  const lowered = str.toLowerCase().trim();
  if (lowered === "meetings") {
    return 1;
  } else if (lowered === "plans") {
    return 2;
  } else {
    return 0;
  }
};

export default function MentoringUserProfile({
  mentee,
  mentor,
  perspective,
}: UserProfileProps) {
  const [tab, setTab] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const selectedTab = searchParams.get("tab");
    setTab(tabStringToIndex(selectedTab));
  });

  return (
    <div className="mx-5">
      {/* Title */}
      <div className="grid grid-cols-10">
        {perspective === "mentor" ? (
          <Link
            to="/mentoring/mentees"
            className="text-blue-600 hover:text-blue-900 flex items-center mb-2 col-span-2"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to your Mentees
          </Link>
        ) : (
          <div className="col-span-2" />
        )}

        <h1 className="text-xl font-bold text-center col-span-6">
          {perspective === "mentee"
            ? "Your Profile"
            : `${mentee.first_name} ${mentee.last_name}'s Profile`}
        </h1>

        <div className="col-span-2" />
      </div>

      <Tab.Group
        selectedIndex={tab}
        onChange={(index) => setSearchParams({ tab: tabIndexToString(index) })}
      >
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
            General
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
            <GeneralInfo
              mentor={mentor}
              mentee={mentee}
              perspective={perspective}
            />
          </Tab.Panel>
          <Tab.Panel key="meetings">
            <MentoringMeetings perspective={perspective} />
          </Tab.Panel>
          <Tab.Panel key="plans">
            <PlansOfAction
              mentor={mentor}
              mentee={mentee}
              perspective={perspective}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
