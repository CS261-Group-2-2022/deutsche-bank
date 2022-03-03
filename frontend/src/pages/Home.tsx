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
import UpcomingSession from "../components/UpcomingSessions";
import UserAvatar from "../components/UserAvatar";
import { useUser } from "../utils/authentication";
import {
  CURRENT_MENTEES_ENDPOINT,
  ExtendedMeeting,
  FULL_USER_ENDPOINT,
  GroupSession,
  GroupSessionResponse,
  LIST_USER_SUGGESTED_SESSIONS_ENDPOINT,
  Mentorship,
  MENTORSHIP_ENDPOINT,
  UpcomingSessions,
  UPCOMING_SESSIONS_ENDPOINT,
  UserFull,
} from "../utils/endpoints";

type ActionProps = {
  actionText: string;
  buttonText?: string;
  onClick: () => void;
};

function Action({ actionText, buttonText = "View", onClick }: ActionProps) {
  return (
    <div className="shadow rounded-2xl bg-white px-4 py-2 border">
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
    <div className="rounded-2xl p-2 space-y-2">
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
  const { user } = useUser();
  const { data: mentorship } = useSWR<Mentorship>(
    user && user.mentorship
      ? MENTORSHIP_ENDPOINT.replace("{ID}", user.mentorship.toString())
      : null
  );
  const { data: mentor } = useSWR<UserFull>(
    mentorship
      ? FULL_USER_ENDPOINT.replace("{ID}", mentorship.mentor.toString())
      : null
  );
  const { data: currentMentees } = useSWR<UserFull[]>(CURRENT_MENTEES_ENDPOINT);

  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="flex flex-col rounded-2xl p-2 space-y-2 grow">
        <h4 className="text-l sm:text-xl font-semibold">Your Mentor</h4>
        {mentor ? (
          <Link
            to="/mentoring/me"
            className="mt-2 py-2 px-4 flex grow justify-between items-center border bg-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <div className="flex gap-2">
              <UserAvatar user={mentor} />
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-lg text-gray-900">
                  {mentor.first_name} {mentor.last_name}
                </h4>
                <h6 className="font-medium text-sm text-gray-700">
                  {mentor.business_area.name}
                </h6>
              </div>
            </div>
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <>
            <p className="text-m align-middle grow">
              You currently do not have a mentor
            </p>
            <Link
              to="/mentoring/me"
              className="mt-2 py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Find me a mentor
              <span>
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-col rounded-2xl p-2 space-y-2">
        <h4 className="text-l sm:text-xl font-semibold">Your Mentees</h4>
        {currentMentees && currentMentees.length > 0 ? (
          <Link
            to="/mentoring/mentees"
            className="mt-2 py-2 px-4 grow flex flex-col justify-center items-center border bg-white text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            <span className="flex flex-wrap justify-center -space-x-2 mr-2">
              {currentMentees.map((mentee) => (
                <img
                  key={mentee.id}
                  className="inline-block h-10 w-10 rounded-full object-cover ring-2 ring-white"
                  src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                  alt={mentee.first_name}
                />
              ))}
            </span>
            <div className="flex items-center">
              You have {currentMentees.length} mentee
              {currentMentees.length == 1 ? "" : "s"}
              <span>
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </span>
            </div>
          </Link>
        ) : (
          <>
            <p className="grow text-m align-middle">
              You are not currently mentoring anyone
            </p>
            <Link
              to="/mentoring/mentees"
              className="mt-2 py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Start mentoring
              <span>
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function GroupSessionsInfo() {
  const { data: recommendedSessions = [] } = useSWR<GroupSessionResponse>(
    LIST_USER_SUGGESTED_SESSIONS_ENDPOINT
  );

  const numAvailableSessions = recommendedSessions.length;

  return (
    <div className="bg-gray-50rounded-2xl p-2 space-y-2">
      <h4 className="text-l sm:text-xl font-semibold flex items-center">
        <UserGroupIcon className="mr-2 h-5 w-5" />
        Group Sessions
      </h4>
      <div className="flex justify-between items-center">
        <p className="text-m">
          There {numAvailableSessions == 1 ? "is" : "are"}{" "}
          <span className="font-bold">{numAvailableSessions}</span> group
          session{numAvailableSessions == 1 ? " " : "s "}
          available which match{numAvailableSessions == 1 ? "es" : ""} your
          interests
        </p>
        <Link
          to="/groups"
          className="py-2 px-10 flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
        >
          Visit Sessions
          <span>
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function UpcomingSessionsColumn() {
  const { data: upcomingSessions = { meetings: [], sessions: [] } } =
    useSWR<UpcomingSessions>(UPCOMING_SESSIONS_ENDPOINT);

  type MeetingFlagged = { isMeeting: true } & ExtendedMeeting;
  type SessionFlagged = { isMeeting: false } & GroupSession;

  type AllSessions = (MeetingFlagged | SessionFlagged)[];
  const allSessions: AllSessions = [
    ...(upcomingSessions.meetings.map((x) =>
      Object.assign({ isMeeting: true }, x)
    ) as MeetingFlagged[]),
    ...(upcomingSessions.sessions.map((x) =>
      Object.assign({ isMeeting: false }, x)
    ) as SessionFlagged[]),
  ].sort(
    (a, b) =>
      Date.parse(a.isMeeting ? a.time : a.date) -
      Date.parse(b.isMeeting ? b.time : b.date)
  );

  return (
    <div className="flex flex-col rounded-2xl border-gray-100 p-2 text-center max-h-[90vh]">
      <h4 className="text-l sm:text-xl font-semibold flex items-center justify-center">
        <CalendarIcon className="mr-2 h-5 w-5" />
        <div className="mb-2">Upcoming Sessions</div>
      </h4>
      <div className="flex flex-col justify-start gap-1 grow overflow-auto">
        {allSessions.length == 0 ? (
          <div className="align-items-">You have no upcoming sessions</div>
        ) : (
          allSessions.map((session) => (
            <UpcomingSession
              key={(session.isMeeting ? "MEETING-" : "") + session.id}
              isMeeting={session.isMeeting}
              event={session}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="bg-white w-full">
        <div className="grid grid-cols-3 mx-5 gap-5">
          <div className="col-span-2 space-y-5">
            <ActionRequiredBox />
            <hr />
            <MentoringInfo />
            <hr />
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
