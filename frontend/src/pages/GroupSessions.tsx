import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { ChevronUpIcon, PlusIcon } from "@heroicons/react/solid";
import {
  GroupSession,
  GroupSessionResponse,
  LIST_GROUP_SESSIONS_ENDPOINT,
  LIST_USER_HOSTING_SESSIONS_ENDPOINT,
  LIST_USER_JOINED_SESSIONS_ENDPOINT,
} from "../utils/endpoints";
import Topbar from "../components/Topbar";
import SessionInfoPopup from "../components/SessionInfoPopup";
import SessionTopicLabel from "../components/SessionTopicLabel";
import LocationText from "../components/LocationText";
import DateTextProps from "../components/DateText";
import CreateSessionPopup from "../components/CreateSessionPopup";
import SearchBar from "../components/SearchBar";
import { Disclosure } from "@headlessui/react";

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
    <div className="w-full rounded-lg p-2">
      <div className="flex items-center space-x-4">
        <img
          alt="Session Image"
          src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
          className="h-20 rounded-lg"
        />

        <div className="flex-auto flex-col">
          <h1 className="font-bold text-xl">{session.name}</h1>
          <div className="flex space-x-1">
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

        <div>
          <button
            type="button"
            onClick={selectSession}
            className="py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            View More
          </button>
        </div>
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

export default function GroupSessions() {
  // Pull in session data from backend
  const { data: allSessions = [] } = useSWR<GroupSessionResponse>(
    LIST_GROUP_SESSIONS_ENDPOINT
  );
  const { data: joinedSessions } = useSWR<GroupSessionResponse>(
    LIST_USER_JOINED_SESSIONS_ENDPOINT
  );
  const { data: hostingSessions } = useSWR<GroupSessionResponse>(
    LIST_USER_HOSTING_SESSIONS_ENDPOINT
  );

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
      setSelectedSession(
        allSessions.find((session) => session.id == selectedSession.id)
      );
    }
  }, [allSessions]);

  // When the selected session changes, we should update the search parameters
  useEffect(() => {
    if (selectedSession) {
      setSearchParams({ id: selectedSession.id.toString() });
    } else {
      setSearchParams({});
    }
  }, [selectedSession, setSearchParams]);

  // Read the search parameters to set the selected session
  useEffect(() => {
    const selectedIdText = searchParams.get("id");
    if (selectedIdText) {
      const selectedId = Number(selectedIdText);
      // Ignore if the session is already correct
      if (selectedSession && selectedSession.id === selectedId) return;
      const session = allSessions.find((session) => session.id == selectedId);

      // Check if the session with the ID actually exists. If it doesn't, then
      // just clear the ID
      if (session) {
        setSelectedSession(session);
      } else {
        setSearchParams({});
      }
    } else {
      // Disable the selected session if it has changed
      if (selectedSession) {
        setSelectedSession(undefined);
      }
    }
  }, [searchParams, setSelectedSession, setSearchParams]);

  const sessionFilter = (session: GroupSession) => {
    if (!isFiltering) return true;
    return (
      session.name.toLowerCase().includes(lowerSearchText) ||
      session.skills?.some((skill) =>
        skill.toString().toLowerCase().includes(lowerSearchText)
      )
    );
  };

  const filteredSessions = allSessions
    // TODO: Only show sessions in the future
    // .filter((session) => Date.parse(session.date) >= Date.now())
    // Filter out sessions you are hosting or have already joined
    .filter(
      (session) =>
        !joinedSessions?.find(
          (otherSession) => session.id == otherSession.id
        ) &&
        !hostingSessions?.find((otherSession) => session.id == otherSession.id)
    )
    .filter(sessionFilter); // Filter by the user searchbar input
  // TODO: Sort by the closest start date
  // .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  return (
    <>
      <Topbar />
      <SessionInfoPopup
        session={selectedSession}
        isOpen={selectedSession !== undefined}
        closeModal={() => setSelectedSession(undefined)}
      />
      <CreateSessionPopup
        isOpen={creatingSession}
        closeModal={() => setCreatingSession(false)}
      />
      <div className="relative mx-5 space-y-3">
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
            setSelectedSession={setSelectedSession}
          />
        )}

        {joinedSessions && joinedSessions.length > 0 && (
          <HideableSessionsInfo
            title="Sessions You've Joined"
            sessions={joinedSessions}
            setSelectedSession={setSelectedSession}
          />
        )}

        <h2 className="text-gray-900 font-bold text-2xl">Available Sessions</h2>

        <div className="space-y-2">
          {filteredSessions.map((session) => (
            <SessionInfo
              key={session.id}
              session={session}
              selectSession={() => setSelectedSession(session)}
            />
          ))}

          {filteredSessions.length === 0 && (
            <h1 className="font-bold text-xl text-gray-700 mt-10 text-center">
              There are no sessions available
              {isFiltering && " which match your search filter"}. Maybe create a
              new one?
            </h1>
          )}
        </div>
      </div>
    </>
  );
}
