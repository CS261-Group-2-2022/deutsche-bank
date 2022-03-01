import { ArrowRightIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { LoadingButton } from "../components/LoadingButton";
import AreasOfExpertise from "../components/mentoring/AreasOfExpertise";
import InterestsDescription from "../components/mentoring/InterestsDescription";
import { UserPanel } from "../components/mentoring/MentoringUserPanel";
import SessionTopicLabel from "../components/SessionTopicLabel";
import Toggle from "../components/Toggle";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import {
  ACCEPT_MENTORING_REQUEST_ENDPOINT,
  CURRENT_MENTEES_ENDPOINT,
  DECLINE_MENTORING_REQUEST_ENDPOINT,
  getAuthToken,
  INCOMING_REQUESTS_ENDPOINT,
  MentorshipRequest,
  PROFILE_ENDPOINT,
  User,
  UserFull,
} from "../utils/endpoints";
import { getSkillFromId, useSkills } from "../utils/skills";

type PendingUserPanelProps = {
  request: MentorshipRequest;
};

const PendingUserPanel = ({ request }: PendingUserPanelProps) => {
  const mentee = request.mentee;
  const { skills } = useSkills();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const makeRequest = (endpoint: string, error: string) => {
    return async () => {
      setIsLoading(true);
      setError(undefined);

      const res = await fetch(endpoint.replace("{ID}", request.id.toString()), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
      });

      const body = await res.json();

      if (res.ok) {
        // TODO: Revalidate the caches for current mentees
        // mutate(MENTORSHIP_ENDPOINT.replace("{ID}", mentorship.id.toString()));
        mutate(CURRENT_MENTEES_ENDPOINT);
        mutate(INCOMING_REQUESTS_ENDPOINT);
      } else {
        setError(body.error?.join(" ") ?? error);
      }

      setIsLoading(false);
    };
  };

  const acceptRequest = makeRequest(
    ACCEPT_MENTORING_REQUEST_ENDPOINT,
    "An error occured when accepting this request. Please try again."
  );

  const declineRequest = makeRequest(
    DECLINE_MENTORING_REQUEST_ENDPOINT,
    "An error occured when declining this request. Please try again."
  );

  return (
    <UserPanel
      user={mentee}
      extra_information={
        <>
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
          {error && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {error}
            </div>
          )}
        </>
      }
      actions={
        <>
          <LoadingButton
            type="button"
            className="flex flex-row items-center py-2 px-5 text-xl bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            isLoading={isLoading}
            onClick={() => acceptRequest()}
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Accept
          </LoadingButton>
          <LoadingButton
            type="button"
            className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            isLoading={isLoading}
            onClick={() => declineRequest()}
          >
            <XIcon className="h-5 w-5 mr-2" />
            Decline
          </LoadingButton>
        </>
      }
    />
  );
};

type PendingRequestsProps = {
  requests: MentorshipRequest[];
};

const PendingRequests = ({ requests }: PendingRequestsProps) => {
  const { user } = useUser();

  const [acceptingRequests, setAcceptingRequests] = useState(
    user?.mentor_intent ?? false
  );

  useEffect(() => {
    setAcceptingRequests(user?.mentor_intent ?? false);
  }, [user]);

  const toggleAccepting = async (enabled: boolean) => {
    // setIsLoading(true);
    // setError(undefined);

    const res = await fetch(PROFILE_ENDPOINT, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        mentor_intent: enabled,
      }),
    });

    const body = await res.json();
    if (res.ok) {
      // Revalidate the cache of the current users data
      mutate(PROFILE_ENDPOINT);
    } else {
      // setError(body.error?.join(" "));
    }

    // setIsLoading(false);
  };

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
            setEnabled={toggleAccepting}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {requests.length > 0 ? (
          requests.map((request) => (
            <PendingUserPanel key={request.id} request={request} />
          ))
        ) : (
          <h4 className="text-gray-700 m-2">You currently have no requests</h4>
        )}
      </div>
    </div>
  );
};

type CurrentMenteesProps = {
  currentMentees: UserFull[];
};

const CurrentMentees = ({ currentMentees }: CurrentMenteesProps) => {
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
                          key={interest.id}
                          name={interest.name}
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
  const { data: currentMentees } = useSWR<UserFull[]>(CURRENT_MENTEES_ENDPOINT);
  const { data: pendingRequests } = useSWR<MentorshipRequest[]>(
    INCOMING_REQUESTS_ENDPOINT
  );
  if (!user) return <></>;

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

        <PendingRequests requests={pendingRequests ?? []} />
        <CurrentMentees currentMentees={currentMentees ?? []} />
      </div>
    </>
  );
}
