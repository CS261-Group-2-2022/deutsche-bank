import {
  ArrowRightIcon,
  CalendarIcon,
  ExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
//import RoundedImage from "../components/RoundedImage";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import { useBusinessAreas } from "../utils/business_area";

type DashboardUserHeroProps = {
  name: string;
  businessArea: string;
};

function DashboardUserHero({ name, businessArea }: DashboardUserHeroProps) {
  return (
    <div className="bg-white">
      <div className="flex flex-row lg:items-center lg:justify-between w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex flex-row items-center gap-5">
          <div className="flex-shrink-0">
            {/* <RoundedImage
              src={
                "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
              }
              alt="profile picture"
              size={24}
            /> */}

            <a href="#" className="block relative">
              <img
                alt="profil"
                src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                className="mx-auto object-cover rounded-full h-24 w-24"
              />
            </a>
          </div>
          <h2>
            <span className="block text-3xl sm:text-4xl font-bold">
              Hi, {name}
            </span>
            <span className="block text-l sm:text-2xl text-gray-500">
              {businessArea}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

type ActionProps = {
  actionText: string;
  buttonText?: string;
  onClick: () => void;
};

function Action({ actionText, buttonText = "View", onClick }: ActionProps) {
  return (
    <div className="shadow rounded-2xl bg-white p-4">
      <div className="flex-row gap-4 flex justify-center items-center">
        <div className="flex-shrink-0">
          <a href="#" className="block relative">
            <img
              alt="profil"
              src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
              className="mx-auto object-cover rounded-full h-8 w-8"
            />
          </a>
          {/* <RoundedImage
            src={
              "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            }
            alt="profile picture"
            size={8}
          /> */}
        </div>
        <div className="flex flex-col w-full">
          <p className="text-gray-800 font-medium">{actionText}</p>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="py-1 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function ActionRequiredBox() {
  return (
    <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 space-y-2">
      <h4 className="text-l sm:text-xl font-semibold flex items-center">
        <ExclamationIcon className="mr-2 h-6 w-6" />
        Actions Required
      </h4>
      {/* <p className="text-m">You have no actions required</p> */}
      <Action
        actionText="Bob has requested to be your mentee"
        onClick={() => undefined}
      />
      <Action
        actionText="John has requested to be your mentee"
        onClick={() => undefined}
      />
      <Action
        actionText="Notes have not been recorded for your meeting with Steve on 25/01"
        onClick={() => undefined}
      />
    </div>
  );
}

function MentoringInfo() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 space-y-2">
        <h4 className="text-l sm:text-xl font-semibold">Your Mentor</h4>
        <p className="text-m align-middle">
          You currently do not have a mentor
          <Link
            to="/mentoring"
            className="mt-2 py-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Find me a mentor
            <span>
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </span>
          </Link>
        </p>
      </div>
      <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 space-y-2">
        <h4 className="text-l sm:text-xl font-semibold">Your Mentees</h4>
        <p className="text-m align-middle">
          You are not currently mentoring anyone
          <Link
            to="/mentoring"
            className="mt-2 py-2 px-4 flex justify-center items-center  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Start mentoring
            <span>
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

function GroupSessionsInfo() {
  return (
    <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 space-y-2">
      <h4 className="text-l sm:text-xl font-semibold flex items-center">
        <UserGroupIcon className="mr-2 h-5 w-5" />
        Group Sessions
      </h4>
      <div className="flex-row gap-4 flex justify-center items-center">
        <div className="flex flex-col w-full">
          <p className="text-m">
            There are <span className="font-bold">3</span> group sessions
            available which match your interests
          </p>
        </div>
        <div className="flex flex-col">
          <Link
            to="/groups"
            className="py-2 px-10 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
          >
            Visit Sessions
            <span>
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function UpcomingSessionsColumn() {
  return (
    <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 text-center h-full">
      <h4 className="text-l sm:text-xl font-semibold flex items-center justify-center">
        <CalendarIcon className="mr-2 h-5 w-5" />
        Upcoming Sessions
      </h4>
      <div className="flex justify items-center justify-center h-full">
        <p className="text-m align-middle">
          You have no upcoming sessions scheduled
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useUser();
  const { areas } = useBusinessAreas();

  return (
    <>
      <Topbar />
      <DashboardUserHero
        name={user ? `${user.first_name} ${user.last_name}` : `UNKNOWN`}
        businessArea={
          areas.find((area) => area.id == user?.business_area)?.name ??
          "Unknown"
        }
      />
      <div className="bg-white w-full">
        <div className="grid grid-cols-3 mx-5 gap-5">
          <div className="col-span-2 space-y-5">
            <ActionRequiredBox />
            <MentoringInfo />
            <GroupSessionsInfo />
          </div>
          <div>
            <UpcomingSessionsColumn />
          </div>
        </div>
      </div>
    </>
  );
}
