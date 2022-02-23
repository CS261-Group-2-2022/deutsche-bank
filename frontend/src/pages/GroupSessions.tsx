import {
  CalendarIcon,
  LocationMarkerIcon,
  PlusIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import Topbar from "../components/Topbar";
import {
  GroupSession,
  GroupSessionResponse,
  LIST_GROUP_SESSIONS_ENDPOINT,
} from "../utils/endpoints";
import useSWR from "swr";
import SessionInfoPopup from "../components/SessionInfoPopup";
import { useEffect, useState } from "react";
import SessionTopicLabel from "../components/SessionTopicLabel";

import LocationText from "../components/LocationText";
import DateTextProps from "../components/DateText";
import CreateSessionPopup from "../components/CreateSessionPopup";
import { createAsExpression } from "typescript";

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
    <div className="w-full bg-gray-50 rounded-lg p-2">
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
              <SessionTopicLabel key={skill} name={skill} />
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
  const { data: apiData } = useSWR<GroupSessionResponse>(LIST_GROUP_SESSIONS_ENDPOINT);
  const data = apiData ?? [];

  // let data: GroupSession[] = [
  //   {
  //     id: 1,
  //     name: "Session A",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     skills: ["Maths", "ML", "Python"],
  //     location: "The Moon",
  //     date: "in 3 days",
  //   },
  //   {
  //     id: 2,
  //     name: "Session B",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     skills: ["Maths", "ML", "Python"],
  //     location: "The Moon",
  //     date: "in 3 days",
  //   },
  //   {
  //     id: 3,
  //     name: "Session C",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     skills: ["Maths", "ML", "Python"],
  //     location: "The Moon",
  //     date: "in 3 days",
  //   },
  //   {
  //     id: 4,
  //     name: "Session D",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     skills: ["Maths", "ML", "Python"],
  //     location: "The Moon",
  //     date: "in 3 days",
  //   },
  //   {
  //     id: 5,
  //     name: "Session E",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  //     skills: ["Maths", "ML", "Python"],
  //     location: "The Moon",
  //     date: "in 3 days",
  //   },
    
  // ];

  // async function getGroupSessions() {
  //   const res = await fetch(LIST_GROUP_SESSIONS_ENDPOINT);
  //   data = await res.json();
  //   console.log(data);
  //   console.log("inside")

  //   return "";

  // }

  // getGroupSessions();

  console.log(data);
  // console.log("outside");

  const [selectedSession, setSelectedSession] = useState<
    GroupSession | undefined
  >();
  const [creatingSession, setCreatingSession] = useState(false);

  const [searchText, changeSearchText] = useState("");
  const lowerSearchText = searchText.toLowerCase().trim();
  const isFiltering = lowerSearchText !== "";

  const sessionFilter = (session: GroupSession) => {
    if (!isFiltering) return true;
    return (
      session.name.toLowerCase().includes(lowerSearchText) ||
      session.skills?.some((skill) =>
        skill.toLowerCase().includes(lowerSearchText)
      )
    );
  };

  const filteredSessions = data.filter(sessionFilter);

  console.log("just before return");
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

        <h2>Joined Sessions</h2>
        <SessionInfo
          session={data[0]}
          selectSession={() => setSelectedSession(undefined)}
        />
        <hr></hr>
        <h2>All sessions</h2>

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
