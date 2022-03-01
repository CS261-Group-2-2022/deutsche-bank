import { ArrowRightIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import AreasOfExpertise from "../components/mentoring/AreasOfExpertise";
import InterestsDescription from "../components/mentoring/InterestsDescription";
import { UserPanel } from "../components/mentoring/MentoringUserPanel";
import SessionTopicLabel from "../components/SessionTopicLabel";
import Toggle from "../components/Toggle";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import { User } from "../utils/endpoints";
import { getSkillFromId, useSkills } from "../utils/skills";

type PendingRequestsProps = {
  requests: User[];
};

const PendingRequests = ({ requests }: PendingRequestsProps) => {
  const { skills } = useSkills();

  const [acceptingRequests, setAcceptingRequests] = useState(false);

  // TODO: connect toggle to backend

  return (
    <div>
      <div className="flex justify-between mb-1">
        <h1 className="font-bold text-xl text-gray-800">
          Pending Mentee Requests
        </h1>
        <div className="flex gap-2">
          <p className="text-gray-700 font-medium">Accepting new requests</p>
          <Toggle
            name="Accepting new mentees"
            enabled={acceptingRequests}
            setEnabled={setAcceptingRequests}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {requests.length > 0 ? (
          requests.map((mentee) => (
            <UserPanel
              key={mentee.id}
              user={mentee}
              extra_information={
                <p className="text-sm">
                  {mentee.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <span>Interested in:</span>
                      {mentee.interests.map((interest) => (
                        <SessionTopicLabel
                          key={interest}
                          name={getSkillFromId(interest, skills)?.name ?? ""}
                        />
                      ))}
                    </div>
                  ) : (
                    "No current interests"
                  )}
                </p>
              }
              actions={
                <>
                  <button
                    type="button"
                    className="flex flex-row items-center py-2 px-5 text-xl bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Accept
                  </button>
                  <button
                    type="button"
                    className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    <XIcon className="h-5 w-5 mr-2" />
                    Decline
                  </button>
                </>
              }
            />
          ))
        ) : (
          <h4 className="text-gray-700 m-2">You currently have no requests</h4>
        )}
      </div>
    </div>
  );
};

type CurrentMenteesProps = {
  currentMentees: User[];
};

const CurrentMentees = ({ currentMentees }: CurrentMenteesProps) => {
  const { skills } = useSkills();

  return (
    <div>
      <h1 className="font-bold text-xl text-gray-800">Your Mentees</h1>
      <div className="flex flex-col gap-3">
        {currentMentees.length > 0 ? (
          currentMentees.map((mentee) => (
            <UserPanel
              key={mentee.id}
              user={mentee}
              extra_information={
                <p className="text-sm">
                  {mentee.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <span>Interested in:</span>
                      {mentee.interests.map((interest) => (
                        <SessionTopicLabel
                          key={interest}
                          name={getSkillFromId(interest, skills)?.name ?? ""}
                        />
                      ))}
                    </div>
                  ) : (
                    "Currently not interested in anything"
                  )}
                </p>
              }
              actions={
                <Link
                  to={`/mentoring/${mentee.id}`}
                  className="flex flex-row items-center py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  View Profile
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              }
            />
          ))
        ) : (
          <h4 className="text-gray-700 m-2">You currently have no mentees</h4>
        )}
      </div>
    </div>
  );
};

export default function YourMentees() {
  // Display a list of incoming mentee requests, and your current mentees
  const { user } = useUser();

  if (!user) return <></>;

  const currentMentees: User[] = [user, user, user];
  const pendingRequests: User[] = [user, user];

  return (
    <>
      <Topbar />
      <div className="mx-5">
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="font-bold text-2xl">Your Mentees</h1>
        </div>

        <div className="border rounded-lg p-2 my-2">
          <AreasOfExpertise
            subHeading="Your areas of expertise will help inform your matches to find the most compatible mentees."
            user={user}
            canEdit
          />
        </div>
        <div className="border rounded-lg p-2 my-2">
          <InterestsDescription
            subHeading="Your interests description is a free-text field which will be analysed to find mentees with similar interests."
            user={user}
            canEdit
          />
        </div>

        <PendingRequests requests={pendingRequests} />
        <CurrentMentees currentMentees={currentMentees} />
      </div>
    </>
  );
}
