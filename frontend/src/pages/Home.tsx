import {
  ArrowRightIcon,
  CalendarIcon,
  ExclamationIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  applyNotificationAction,
  createNotificationTitle,
} from "../components/NotificationsPopup";
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
  isGroupSessionPrompt,
  LIST_ACTION_NOTIFICATIONS,
  LIST_ALL_NOTIFICATIONS,
  LIST_USER_SUGGESTED_SESSIONS_ENDPOINT,
  Mentorship,
  MENTORSHIP_ENDPOINT,
  Notification,
  UpcomingSessions,
  UPCOMING_SESSIONS_ENDPOINT,
  UserFull,
} from "../utils/endpoints";

type ActionProps = {
  action: Notification;
};

function Action({ action }: ActionProps) {
  const navigate = useNavigate();
  const actionText = createNotificationTitle(action);
  const buttonText = "View";

  return (
    <div className="shadow rounded-lg bg-white px-4 py-2 border">
      <div className="flex-row gap-4 flex justify-center items-center">
        <div className="flex-shrink-0">
          <a href="#" className="block relative">
            {/* TODO: user avatar here? whos avatar should it be? or maybe no avatar, and instead an icon? */}
            <UserAvatar size={8} />
          </a>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-gray-800 font-medium">{actionText}</p>
        </div>
        <button
          type="button"
          onClick={() => applyNotificationAction(action, navigate)}
          className="py-1 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function ActionRequiredBox() {
  const { data: actions } = useSWR<Notification[]>(
    LIST_ACTION_NOTIFICATIONS,
    null,
    {
      refreshInterval: 60 * 1000, // every 60 seconds
    }
  );

  return (
    <div className="rounded-2xl p-2 space-y-2">
      <h4 className="text-l sm:text-xl font-semibold flex items-center">
        <ExclamationIcon className="mr-2 h-6 w-6" />
        Actions Required
      </h4>
      {actions && actions.length > 0 ? (
        actions.map((action) => <Action key={action.id} action={action} />)
      ) : (
        <p className="text-m">You have no actions required</p>
      )}
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
              <UserAvatar user={mentor} size={12} />
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
                <UserAvatar
                  key={mentee.id}
                  user={mentee}
                  size={10}
                  className="inline-block ring-2 ring-white"
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
  const { data: notifications = [] } = useSWR<Notification[]>(
    LIST_ALL_NOTIFICATIONS
  );

  const numAvailableSessions = recommendedSessions.length;

  // Check our notifications to see if we have received prompts for any sessions in demand
  // If so, display an alert for this
  const skillsInDemand = notifications
    .filter(isGroupSessionPrompt)
    .map((notification) => notification.info.skill).length;

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
          interests.{" "}
          {skillsInDemand > 0 && (
            <>
              <br />
              There is also demand for group sessions in{" "}
              <span className="font-bold">{skillsInDemand}</span> topic
              {skillsInDemand == 1 ? " " : "s "} which you are an expert in.
            </>
          )}
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
