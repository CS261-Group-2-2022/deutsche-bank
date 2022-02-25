import {
  ArrowRightIcon,
  CalendarIcon,
  ExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import useSWR from "swr";
//import RoundedImage from "../components/RoundedImage";
import Topbar from "../components/Topbar";
import UpcomingSessions from "../components/UpcomingSessions";
import { useUser } from "../utils/authentication";
import { useBusinessAreas } from "../utils/business_area";
import { GroupSessionResponse, LIST_GROUP_SESSIONS_ENDPOINT, LIST_USER_HOSTING_SESSIONS_ENDPOINT, LIST_USER_JOINED_SESSIONS_ENDPOINT } from "../utils/endpoints";

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
  const { data: allSessions = [] } = useSWR<GroupSessionResponse>(
    LIST_GROUP_SESSIONS_ENDPOINT
  );
  const { data: joinedSessions } = useSWR<GroupSessionResponse>(
    LIST_USER_JOINED_SESSIONS_ENDPOINT
  );
  const { data: hostingSessions } = useSWR<GroupSessionResponse>(
    LIST_USER_HOSTING_SESSIONS_ENDPOINT
  );

  const numAvailableSessions = allSessions
    // TODO: Only show sessions in the future
    // .filter((session) => Date.parse(session.date) >= Date.now())
    // Filter out sessions you are hosting or have already joined
    .filter(
      (session) =>
        !joinedSessions?.find(
          (otherSession) => session.id == otherSession.id
        ) &&
        !hostingSessions?.find((otherSession) => session.id == otherSession.id)
    ).length

  return (
    <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 space-y-2">
      <h4 className="text-l sm:text-xl font-semibold flex items-center">
        <UserGroupIcon className="mr-2 h-5 w-5" />
        Group Sessions
      </h4>
      <div className="flex-row gap-4 flex justify-center items-center">
        <div className="flex flex-col w-full">
          <p className="text-m">
            There {numAvailableSessions == 1 ? "is" : "are"} <span className="font-bold">{numAvailableSessions}</span> group session{numAvailableSessions == 1 ? " " : "s "}
            available which match{numAvailableSessions == 1 ? "es" : ""} your interests
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
  const { data: apiSessionData } = useSWR<GroupSessionResponse>(
    LIST_USER_JOINED_SESSIONS_ENDPOINT
  );
  const allJoinedSessions = apiSessionData ?? [];

  const { data: apiHostSessionData } = useSWR<GroupSessionResponse>(
    LIST_USER_HOSTING_SESSIONS_ENDPOINT
  );
  const allHostSessions = apiHostSessionData ?? [];

  console.log(allHostSessions.toString());


  let allSessions = [...allJoinedSessions, ...allHostSessions];
  allSessions = allSessions.sort((a,b) => Date.parse(a.date) - Date.parse(b.date)).filter((c) => Date.parse(c.date) >= Date.now());

  return (
    <div className="bg-gray-50 rounded-2xl border-gray-100 border-2 p-2 text-center h-full">
      <h4 className="text-l sm:text-xl font-semibold flex items-center justify-center">
        <CalendarIcon className="mr-2 h-5 w-5" />
        <div className="mb-2">
        Upcoming Sessions
        </div>
      </h4>
      <div className="justify justify-center grid grid-cols-1 gap-1">
        {allSessions.length == 0 ? <div className="align-items-">You have no upcoming sessions</div> : allSessions.map((session) => (
          <>
          <UpcomingSessions session={session}/>
          </>
        ))}
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
      {/* <DashboardUserHero
        name={user ? `${user.first_name} ${user.last_name}` : `UNKNOWN`}
        businessArea={
          areas.find((area) => area.id == user?.business_area)?.name ??
          "Unknown"
        }
      /> */}
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
