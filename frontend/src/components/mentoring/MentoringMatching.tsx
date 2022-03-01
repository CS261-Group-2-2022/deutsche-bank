import {
  CANCEL_MENTORING_REQUEST_ENDPOINT,
  CREATE_MENTORING_REQUEST_ENDPOINT,
  getAuthToken,
  MentorshipRequest,
  OUTGOING_REQUESTS_ENDPOINT,
  SUGGESTED_MENTORS_ENDPOINT,
  User,
} from "../../utils/endpoints";
import { UserPanel } from "./MentoringUserPanel";
import SessionTopicLabel from "../SessionTopicLabel";
import { getSkillFromId, useSkills } from "../../utils/skills";
import AreasOfInterest from "./AreasOfInterest";
import InterestsDescription from "./InterestsDescription";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import { LoadingButton } from "../LoadingButton";
import { RefreshIcon, UserGroupIcon, XIcon } from "@heroicons/react/solid";

type RecommendationPanelProps = {
  mentor: User;
};

const RecommendationPanel = ({ mentor }: RecommendationPanelProps) => {
  const { skills } = useSkills();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sendRequest = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const res = await fetch(CREATE_MENTORING_REQUEST_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({
          mentor: mentor.id,
        }),
      });

      const body = await res.json();
      if (res.ok) {
        // Revalidate the cache of the current users outgoing requests
        mutate(SUGGESTED_MENTORS_ENDPOINT);
        mutate(OUTGOING_REQUESTS_ENDPOINT);
      } else {
        setError(
          body.error ??
            "An error occured when sending this request. Please try again."
        );
      }
    } catch (_err) {
      setError("An error occured when sending this request. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <UserPanel
      user={mentor}
      extra_information={
        <>
          <p className="text-sm">
            {mentor.expertise.length > 0 ? (
              <>
                Expert in:
                <span className="flex flex-wrap gap-1 pl-1">
                  {mentor.expertise.map((expertise) => (
                    <SessionTopicLabel
                      key={expertise}
                      name={getSkillFromId(expertise, skills)?.name ?? ""}
                    />
                  ))}
                </span>
              </>
            ) : (
              "No expertise"
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
        <LoadingButton
          type="button"
          className="flex flex-row items-center py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          isLoading={isLoading}
          onClick={() => sendRequest()}
        >
          Send Request
        </LoadingButton>
      }
    />
  );
};

type OutgoingRequestPanelProps = {
  request: MentorshipRequest;
};

const OutgoingRequestPanel = ({ request }: OutgoingRequestPanelProps) => {
  const mentor = request.mentor;

  const { skills } = useSkills();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const cancelRequest = async () => {
    setIsLoading(true);
    setError(undefined);

    const res = await fetch(
      CANCEL_MENTORING_REQUEST_ENDPOINT.replace(
        "{ID}",
        request.id.toString() ?? ""
      ),
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
      }
    );

    const body = await res.json();
    if (res.ok) {
      // Revalidate the cache of the current users outgoing requests
      mutate(SUGGESTED_MENTORS_ENDPOINT);
      mutate(OUTGOING_REQUESTS_ENDPOINT);
    } else {
      setError(
        body.error ??
          "An error occurred when cancelling this request. Please try again"
      );
    }

    setIsLoading(false);
  };

  return (
    <UserPanel
      user={mentor}
      extra_information={
        <>
          <p className="text-sm">
            {mentor.expertise.length > 0 ? (
              <>
                Expert in:
                <span className="space-x-1 pl-1">
                  {mentor.expertise.map((expertise) => (
                    <SessionTopicLabel
                      key={expertise}
                      name={getSkillFromId(expertise, skills)?.name ?? ""}
                    />
                  ))}
                </span>
              </>
            ) : (
              "No expertise"
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
        <LoadingButton
          type="button"
          className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          isLoading={isLoading}
          onClick={() => cancelRequest()}
        >
          <XIcon className="h-5 w-5 mr-2" />
          Cancel
        </LoadingButton>
      }
    />
  );
};

type MatchingPageProps = {
  user: User;
};

export default function MentoringMatchingPage({ user }: MatchingPageProps) {
  const { data: requests } = useSWR<MentorshipRequest[]>(
    OUTGOING_REQUESTS_ENDPOINT
  );

  // We wait until the user explicitly asks to fetch recommendations before starting it.
  // We also prevent revalidation on focus.
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    data: recommendations,
    mutate,
    isValidating,
  } = useSWR<User[]>(shouldFetch ? SUGGESTED_MENTORS_ENDPOINT : null, null, {
    revalidateOnFocus: false,
  });

  console.log(requests);
  console.log(recommendations);

  return (
    <div className="mx-5">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="font-bold text-2xl">You currently have no mentor</h1>
        <h2 className="text-gray-700 text-lg">
          We have provided a list of recommended mentors which best match your
          profile; send a request to your preferred mentor
        </h2>
      </div>

      <div className="border rounded-lg p-2 mt-2">
        <AreasOfInterest
          subHeading="Your areas of interest will help inform your matches to find the best mentor for you."
          user={user}
          canEdit
        />
      </div>

      <div className="border rounded-lg p-2 mt-2">
        <InterestsDescription
          subHeading="Your interests description is a free-text field which will be analysed to find mentors with similar interests."
          user={user}
          canEdit
        />
      </div>

      {/* Current Outgoing Requests */}
      {requests && requests.length > 0 && (
        <>
          <div className="pt-5 pb-2">
            <h3 className="font-bold text-xl text-gray-800">
              Mentor Requests Sent
            </h3>
            <h4 className="text-gray-600 text-sm">
              You have sent a request out to these potential mentors. Once
              somebody accepts, they will become your mentor.
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <OutgoingRequestPanel key={request.id} request={request} />
            ))}
          </div>
        </>
      )}

      {/* Recommended Mentors */}
      <div className="pt-5 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gray-800">Recommendations</h3>
          {shouldFetch && (
            <LoadingButton
              isLoading={isValidating}
              onClick={() => mutate()}
              className="my-3 py-2 px-10 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
            >
              <RefreshIcon className="w-5 h-5 pr-1" />
              Refresh Recommendations
            </LoadingButton>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {!shouldFetch ? (
            <LoadingButton
              isLoading={isValidating}
              onClick={() => setShouldFetch(true)}
              className="my-3 py-2 px-10 flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg shadow-md"
            >
              <UserGroupIcon className="w-5 h-5 pr-1" />
              Get Recommendations
            </LoadingButton>
          ) : recommendations && recommendations.length > 0 ? (
            recommendations.map((mentor) => (
              <RecommendationPanel key={mentor.id} mentor={mentor} />
            ))
          ) : (
            <h4 className="font-medium text-xl text-gray-700 mt-10 text-center">
              There are currently no available mentors which match your profile.
              Please refresh or try again later.
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}
