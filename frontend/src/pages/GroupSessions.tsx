import { PlusIcon } from "@heroicons/react/solid";
import Topbar from "../components/Topbar";
import {
  GroupSession,
  GroupSessionResponse,
  LIST_GROUP_SESSIONS_ENDPOINT,
  LIST_USER_JOINED_SESSIONS_ENDPOINT,
} from "../utils/endpoints";
import useSWR from "swr";
import { useUser } from "../utils/authentication";
import SessionInfoPopup from "../components/SessionInfoPopup";
import { useEffect, useState } from "react";
import SessionTopicLabel from "../components/SessionTopicLabel";

import LocationText from "../components/LocationText";
import DateTextProps from "../components/DateText";
import CreateSessionPopup from "../components/CreateSessionPopup";
import { useSkills } from "../utils/skills";

type SearchBarProps = {
  searchText: string;
  onChange: (text: string) => unknown;
};

function SearchBar({ searchText, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      {/* <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <SearchIcon className="w-5 h-5" />
      </span> */}
      <input
        type="search"
        className="w-full border p-2 rounded-lg border-gray-400 bg-gray-50 appearance-none focus:outline-none focus:ring-blue-500"
        placeholder="Search"
        value={searchText}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

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
          <LocationText location={session.location} />
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

export default function GroupSessions() {
  // Pull in session data from backend
  const { data: apiData } = useSWR<GroupSessionResponse>(
    LIST_GROUP_SESSIONS_ENDPOINT
  );
  const data = apiData ?? [];
  const { data: joinedSessions } = useSWR<GroupSessionResponse>(
    LIST_USER_JOINED_SESSIONS_ENDPOINT
  );

  // Current component state
  const [selectedSession, setSelectedSession] = useState<
    GroupSession | undefined
  >();
  const [creatingSession, setCreatingSession] = useState(false);

  const [searchText, changeSearchText] = useState("");
  const lowerSearchText = searchText.toLowerCase().trim();
  const isFiltering = lowerSearchText !== "";

  useEffect(() => {
    // When data updates, we should update the object stored in selected session so it uses new information
    if (selectedSession) {
      setSelectedSession(
        data.find((session) => session.id == selectedSession.id)
      );
    }
  }, [data]);

  const sessionFilter = (session: GroupSession) => {
    if (!isFiltering) return true;
    return (
      session.name.toLowerCase().includes(lowerSearchText) ||
      session.skills?.some((skill) =>
        skill.toString().toLowerCase().includes(lowerSearchText)
      )
    );
  };

  const filteredSessions = data
    // .filter((session) => Date.parse(session.date) >= Date.now()) // Only show sessions in the future
    .filter(
      (session) =>
        !joinedSessions?.find((otherSession) => session.id == otherSession.id)
    )
    .filter(sessionFilter) // Filter by the user searchbar input
    // .sort((a, b) => Date.parse(a.date) - Date.parse(b.date)); // Sort by the closest start date
    .sort((a, b) => b.id - a.id); // TODO: DEBUG REMOVE

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

        {joinedSessions && joinedSessions.length > 0 && (
          <>
            <h2 className="text-gray-900 font-bold text-2xl">
              Sessions You{"'"}ve Joined
            </h2>
            <div className="space-y-2">
              {joinedSessions.map((session) => (
                <SessionInfo
                  key={session.id}
                  session={session}
                  selectSession={() => setSelectedSession(session)}
                />
              ))}
            </div>

            <hr></hr>
          </>
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
              There are no sessions available{" "}
              {isFiltering && "which match your search filter"}. Maybe create a
              new one?
            </h1>
          )}
        </div>
      </div>
    </>
  );
}
