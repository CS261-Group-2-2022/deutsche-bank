import { Tab } from "@headlessui/react";
import { ArrowLeftIcon, LockClosedIcon, XIcon } from "@heroicons/react/solid";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { UserPanel } from "../components/MentoringUserPanel";
import SessionTopicLabel from "../components/SessionTopicLabel";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import { User } from "../utils/endpoints";
import Error404 from "./Error404";

type UserProfileProps = {
  user: User;
  perspective: "mentor" | "mentee";
};

function UserProfile({ user, perspective }: UserProfileProps) {
  return (
    <div className="mx-5">
      {perspective === "mentor" && (
        <Link
          to="/mentoring/mentees"
          className="text-blue-600 hover:text-blue-900 flex items-center mb-2"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to your Mentees
        </Link>
      )}

      <h1 className="text-4xl font-bold">
        {perspective === "mentee"
          ? "Your Profile"
          : `${user.first_name} ${user.last_name}'s Profile`}
      </h1>

      <Tab.Group>
        <Tab.List className="flex flex-wrap -mb-px justify-center gap-10 border-b border-gray-200">
          <Tab
            key="info"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Your Mentor
          </Tab>
          <Tab
            key="meetings"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Meetings
          </Tab>
          <Tab
            key="plans"
            className={({ selected }) =>
              `${
                selected
                  ? "text-blue-600 border-blue-600 active"
                  : "text-gray-500 hover:text-gray-600 hover:border-gray-300 border-transparent"
              } inline-block py-4 px-4 text-lg font-medium text-center rounded-t-lg border-b-2`
            }
          >
            Plans of Action
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel key="info">
            INFO
            {/* TODO: current mentor */}
            {/* TODO: give feedback, terminate relationship */}
          </Tab.Panel>
          <Tab.Panel key="meetings">
            MEETINGS
            {/* TODO: past present future meetings */}
            {/* TODO: request new meeting */}
          </Tab.Panel>
          <Tab.Panel key="plans">PLANS OF ACTION</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

function MatchingPage() {
  // TODO: get these from an API
  const { user } = useUser();
  if (!user) return <div />;

  const requests: User[] = [user, user];
  const recommendations: User[] = [user];

  return (
    <div className="mx-5">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="font-bold text-2xl">You currently have no mentor</h1>
        <h2 className="text-gray-700 text-xl">
          We have provided a list of recommended mentors which best match your
          profile; send a request to your preferred mentor
        </h2>
      </div>

      {/* TODO: option to change areas of interest - TODO: if we change areas of interest, should outgoing reqs be cancelled? */}

      {/* Current Outgoing Requests */}
      {requests.length > 0 && (
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
            {requests.map((mentor) => (
              <UserPanel
                key={mentor.id}
                user={mentor}
                extra_information={
                  <p className="text-sm">
                    {mentor.expertise.length > 0 ? (
                      <>
                        Expert in:
                        <span className="space-x-1 pl-1">
                          {mentor.expertise.map((expertise) => (
                            <SessionTopicLabel
                              key={expertise}
                              name={expertise}
                            />
                          ))}
                        </span>
                      </>
                    ) : (
                      "No expertise"
                    )}
                  </p>
                }
                actions={
                  <button
                    type="button"
                    className="flex flex-row items-center py-2 px-5 text-xl bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    <XIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Recommended Mentors */}
      <div className="pt-5 pb-2">
        <h3 className="font-bold text-xl text-gray-800">Recommendations</h3>
        <div className="flex flex-col gap-3">
          {recommendations.map((mentor) => (
            <UserPanel
              key={mentor.id}
              user={mentor}
              extra_information={
                <p className="text-sm">
                  {mentor.expertise.length > 0 ? (
                    <>
                      Expert in:
                      <span className="space-x-1 pl-1">
                        {mentor.expertise.map((expertise) => (
                          <SessionTopicLabel key={expertise} name={expertise} />
                        ))}
                      </span>
                    </>
                  ) : (
                    "No expertise"
                  )}
                </p>
              }
              actions={
                <button
                  type="button"
                  className="flex flex-row items-center py-2 px-5 text-xl bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-100 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                >
                  Send Request
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OwnProfile() {
  const { user } = useUser();
  if (!user) return <></>;

  // eslint-disable-next-line no-constant-condition
  if (true) {
    return <UserProfile user={user} perspective="mentee" />;
  } else {
    return <MatchingPage />;
  }
}

type OtherProfileProps = {
  userId: number;
};

function OtherProfile({ userId }: OtherProfileProps) {
  const navigate = useNavigate();
  // TODO: API request to see if we can view the info

  const allowedToViewProfile = false;

  // Navigate back one step in history
  const navigateBack: React.MouseEventHandler = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  if (allowedToViewProfile) {
    // TODO: Show profile, but from a mentor perspective
  } else {
    // Show permission denied page
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center mx-auto z-20">
          <h1 className="flex flex-row items-center text-3xl font-extrabold text-black sm:text-5xl">
            <LockClosedIcon className="w-14 h-14 mr-2" />
            Permission Denied
          </h1>
          <p className="text-l mt-4 max-w-md mx-auto text-gray-400">
            You do not have permission to view this profile. Only the mentor and
            mentee may view it.
          </p>

          <div className="inline-flex mt-5 space-x-5">
            <button
              onClick={navigateBack}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white hover:text-white transition ease-in duration-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Go back
            </button>
            <Link
              to="/"
              className="py-2 px-4 bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 transition ease-in duration-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div />;
}

export default function MentoringProfile() {
  const { user: loggedInUser } = useUser();
  const { user: viewingUser } = useParams();

  // If there is no parameter for the viewing user (which can't actually ever happen), redirect to your profile
  if (!viewingUser) {
    return <Navigate to="/mentoring/me" />;
  }

  const isViewingOwnProfile =
    viewingUser === "me" || viewingUser === loggedInUser?.id.toString();
  const userId = isViewingOwnProfile ? -1 : parseInt(viewingUser, 10);

  // If an invalid ID was provided, show the 404 page
  if (!userId) {
    return <Error404 />;
  }

  // Steps we need to take:
  // If isViewingOwnProfile, and do not currently have a mentor, then show "search for new mentor" page.
  // If isViewingOwnProfile, and has a mentor, then show profile
  // If not isViewingOwnProfile, and user has permission to view the profile (i.e. is mentor), then show profile
  // If not isViewingOwnProfile, and user does not have permission to view, then show forbidden message.

  return (
    <>
      <Topbar />
      {isViewingOwnProfile ? <OwnProfile /> : <OtherProfile userId={userId} />}
    </>
  );
}
