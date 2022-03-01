import { LockClosedIcon } from "@heroicons/react/solid";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import MentoringMatchingPage from "../components/mentoring/MentoringMatching";
import MentoringUserProfile from "../components/mentoring/Profile";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import Error404 from "./Error404";
import {
  FULL_USER_ENDPOINT,
  Mentorship,
  MENTORSHIP_ENDPOINT,
  User,
  UserFull,
  userFullToUser,
} from "../utils/endpoints";

// Wrapper function which gets mentorship and meeting data before showing a user profile.
// This is separated due to conditional hooks.
type WrapProfileProps = {
  user: User;
  mentorship_id: number;
  perspective: "mentor" | "mentee";
};

function WrapProfile({ user, mentorship_id, perspective }: WrapProfileProps) {
  const { data: mentorship } = useSWR<Mentorship>(
    MENTORSHIP_ENDPOINT.replace("{ID}", mentorship_id.toString())
  );
  const { data: mentor } = useSWR<UserFull>(
    FULL_USER_ENDPOINT.replace("{ID}", user.id.toString() ?? "-1")
  );

  if (!mentorship || !mentor) return <></>;

  return (
    <MentoringUserProfile
      mentee={user}
      mentor={mentor}
      mentorship={mentorship}
      perspective={perspective}
    />
  );
}

function OwnProfile() {
  const { user } = useUser();
  if (!user) return <></>;

  if (user.mentorship) {
    return (
      <WrapProfile
        user={user}
        mentorship_id={user.mentorship}
        perspective="mentee"
      />
    );
  } else {
    return <MentoringMatchingPage />;
  }
}

function PermissionDeniedPage() {
  const navigate = useNavigate();

  // Navigate back one step in history
  const navigateBack: React.MouseEventHandler = (event) => {
    event.preventDefault();
    navigate(-1);
  };

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

type OtherProfileProps = {
  userId: number;
};

function OtherProfile({ userId }: OtherProfileProps) {
  const { user } = useUser();
  const { data: otherUserInfo } = useSWR<UserFull>(
    FULL_USER_ENDPOINT.replace("{ID}", userId.toString())
  );

  // Check to see whether the current user is actually the mentor for this user
  const allowedToViewProfile =
    !user ||
    !otherUserInfo ||
    !otherUserInfo.mentorship ||
    otherUserInfo.mentorship.mentor != user.id;

  if (allowedToViewProfile) {
    return (
      <WrapProfile
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user={userFullToUser(otherUserInfo!)} // TODO: can we not need to do this?
        mentorship_id={otherUserInfo?.mentorship?.id ?? -1} // This can never give -1 since allowedToViewProfile prevents this. TypeScript restriction :(
        perspective="mentor"
      />
    );
  } else {
    return <PermissionDeniedPage />;
  }
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
