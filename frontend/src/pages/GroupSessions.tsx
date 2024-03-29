import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import {
  ChartSquareBarIcon,
  ChevronUpIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import {
  GroupSession,
  GroupSessionResponse,
  LIST_ALL_NOTIFICATIONS,
  LIST_USER_HOSTING_SESSIONS_ENDPOINT,
  LIST_USER_JOINED_SESSIONS_ENDPOINT,
  LIST_USER_SUGGESTED_SESSIONS_ENDPOINT,
  Notification,
  isGroupSessionPrompt,
} from "../utils/endpoints";
import Topbar from "../components/Topbar";
import SessionInfoPopup from "../components/SessionInfoPopup";
import SessionTopicLabel from "../components/SessionTopicLabel";
import LocationText from "../components/LocationText";
import DateTextProps from "../components/DateText";
import CreateSessionPopup from "../components/CreateSessionPopup";
import SearchBar from "../components/SearchBar";
import { Disclosure } from "@headlessui/react";
import { useSkills } from "../utils/skills";

function CreateSessionsButton({ onClick }: { onClick: () => unknown }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-1 px-2 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-400 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-600 transition ease-in duration-100 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
    >
      <PlusIcon className="w-5 h-5 mr-1" />
      Create New Session
    </button>
  );
}

type SessionInfoProps = {
  session: GroupSession;
  selectSession: () => unknown;
};

function SessionInfo({ session, selectSession }: SessionInfoProps) {
  return (
    <div className="w-full flex justify-between items-center rounded-lg p-2">
      <div className="flex items-center space-x-4">
        <img
          alt="Session Image"
          src={
            session.image_link ??
            "https://thinkingportfolio.com/wp-content/uploads/2015/10/02G69046.jpg"
          }
          className="h-20 rounded-lg"
        />

        <div className="flex-auto flex-col">
          <h1 className="font-bold text-xl">{session.name}</h1>
          <div className="flex flex-wrap gap-1">
            {session.skills?.map((skill) => (
              <SessionTopicLabel key={skill.id} name={skill.name} />
            ))}
          </div>
          <LocationText
            location={session.location}
            link={session.virtual_link}
          />
          <DateTextProps date={session.date} />
        </div>
      </div>

      <div className="basis-auto shrink-0">
        <button
          type="button"
          onClick={selectSession}
          className="py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          View More
        </button>
      </div>
    </div>
  );
}

type HideableSessionsInfoProps = {
  title: string;
  sessions: GroupSession[];
  setSelectedSession: (session: GroupSession) => unknown;
};

function HideableSessionsInfo({
  title,
  sessions,
  setSelectedSession,
}: HideableSessionsInfoProps) {
  return (
    <div className="w-full my-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-bold text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 border border-gray-400">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 space-y-2">
              {sessions.map((session) => (
                <SessionInfo
                  key={session.id}
                  session={session}
                  selectSession={() => setSelectedSession(session)}
                />
              ))}

              <hr></hr>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

type InDemandSessionsAlertProps = {
  demandSkills: number[];
};

const InDemandSessionsAlert = ({
  demandSkills,
}: InDemandSessionsAlertProps) => {
  const { skills } = useSkills();

  return (
    <div className="w-full bg-blue-200 rounded-lg p-2 border border-blue-400">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-200 sm:mx-0 sm:h-10 sm:w-10">
          <ChartSquareBarIcon
            className="h-6 w-6 text-blue-700"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 text-left">
          <h3 className="text-lg leading-6 font-medium text-blue-800">
            Sessions In Demand
          </h3>
          <div className="my-1">
            <p className="text-base text-blue-700">
              There is demand for group events in the following areas:
              <ul>
                {demandSkills.map((id) => (
                  <li key={id}>
                    • {skills.find((skill) => skill.id === id)?.name ?? id}
                  </li>
                ))}
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GroupSessions() {
  // Pull in session data from backend
  const { data: recommendedSessionsData, isValidating } =
    useSWR<GroupSessionResponse>(LIST_USER_SUGGESTED_SESSIONS_ENDPOINT);
  const recommendedSessions = recommendedSessionsData ?? [];
  const { data: joinedSessions = [] } = useSWR<GroupSessionResponse>(
    LIST_USER_JOINED_SESSIONS_ENDPOINT
  );
  const { data: hostingSessions = [] } = useSWR<GroupSessionResponse>(
    LIST_USER_HOSTING_SESSIONS_ENDPOINT
  );
  const { data: notifications = [] } = useSWR<Notification[]>(
    LIST_ALL_NOTIFICATIONS
  );

  const findSession = (id: number) =>
    hostingSessions.find((session) => session.id === id) ??
    joinedSessions.find((session) => session.id === id) ??
    recommendedSessions.find((session) => session.id === id);

  // Current search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Current component state
  const [selectedSession, setSelectedSession] = useState<
    GroupSession | undefined
  >();
  const [creatingSession, setCreatingSession] = useState(false);
  const [searchText, changeSearchText] = useState("");
  const lowerSearchText = searchText.toLowerCase().trim();
  const isFiltering = lowerSearchText !== "";

  // When data updates, we should update the object stored in selected session so it uses new information
  useEffect(() => {
    if (selectedSession) {
      setSelectedSession(findSession(selectedSession.id));
    }
  }, [hostingSessions, joinedSessions, recommendedSessions]);

  // Read the search parameters to set the selected session
  useEffect(() => {
    // If the data is only just loading, then ignore for now
    if (isValidating) {
      return;
    }

    const selectedIdText = searchParams.get("id");
    if (selectedIdText) {
      const selectedId = Number(selectedIdText);
      // Ignore if the session is already correct
      if (selectedSession && selectedSession.id === selectedId) return;
      const session = findSession(selectedId);

      // Check if the session with the ID actually exists. If it doesn't, then
      // just clear the ID
      if (session) {
        setSelectedSession(session);
      } else {
        setSearchParams({});
      }
    }
  }, [searchParams, isValidating, setSelectedSession, setSearchParams]);

  const selectSession = (session: GroupSession | undefined) => {
    setSelectedSession(session);
    // Update the search parameters with the new session
    if (session) {
      setSearchParams({ id: session.id.toString() });
    } else {
      setSearchParams({});
    }
  };

  const sessionFilter = (session: GroupSession) => {
    if (!isFiltering) return true;
    return (
      session.name.toLowerCase().includes(lowerSearchText) ||
      session.skills?.some((skill) =>
        skill.name.toLowerCase().includes(lowerSearchText)
      )
    );
  };

  const filteredSessions = recommendedSessions
    // Filter by the user searchbar input
    .filter(sessionFilter);

  // Check our notifications to see if we have received prompts for any sessions in demand
  // If so, display an alert for this
  const demandSkills = notifications
    .filter(isGroupSessionPrompt)
    .map((notification) => notification.info.skill);

  return (
    <>
      <Topbar />
      <SessionInfoPopup
        session={selectedSession}
        isOpen={selectedSession !== undefined}
        closeModal={() => selectSession(undefined)}
      />
      <CreateSessionPopup
        isOpen={creatingSession}
        closeModal={() => setCreatingSession(false)}
      />
      <div className="relative mx-5 space-y-3">
        {demandSkills.length > 0 && (
          <InDemandSessionsAlert demandSkills={demandSkills} />
        )}

        <div className="grid grid-cols-6 gap-3">
          <CreateSessionsButton onClick={() => setCreatingSession(true)} />

          <div className="col-span-5">
            <SearchBar searchText={searchText} onChange={changeSearchText} />
          </div>
        </div>

        {hostingSessions && hostingSessions.length > 0 && (
          <HideableSessionsInfo
            title="Sessions You're Hosting"
            sessions={hostingSessions}
            setSelectedSession={selectSession}
          />
        )}

        {joinedSessions && joinedSessions.length > 0 && (
          <HideableSessionsInfo
            title="Sessions You've Joined"
            sessions={joinedSessions}
            setSelectedSession={selectSession}
          />
        )}

        <h2 className="text-gray-900 font-bold text-2xl">Available Sessions</h2>

        <div className="space-y-2">
          {filteredSessions.map((session) => (
            <SessionInfo
              key={session.id}
              session={session}
              selectSession={() => selectSession(session)}
            />
          ))}

          {!recommendedSessionsData && isValidating ? (
            <div className="flex justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-20 w-20 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            filteredSessions.length === 0 && (
              <h1 className="font-bold text-xl text-gray-700 mt-10 text-center">
                There are no sessions available
                {isFiltering && " which match your search filter"}. Maybe create
                a new one?
              </h1>
            )
          )}
        </div>
      </div>
    </>
  );
}
