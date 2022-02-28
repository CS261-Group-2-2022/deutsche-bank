import { LockClosedIcon, XIcon } from "@heroicons/react/solid";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import MentoringMatchingPage from "../components/mentoring/MentoringMatching";
import MentoringUserProfile from "../components/mentoring/Profile";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";
import Error404 from "./Error404";
import { FULL_USER_ENDPOINT, UserFull } from "../utils/endpoints";

function OwnProfile() {
  const { user } = useUser();
  if (!user) return <></>;

  // GET MENTOR HERE
  const { data: mentor } = useSWR<UserFull>(
    FULL_USER_ENDPOINT.replace("{ID}", user.id.toString() ?? "-1")
  );

  if (/*user.mentorship && */ mentor) {
    return (
      <MentoringUserProfile
        mentee={user}
        mentor={mentor}
        perspective="mentee"
      />
    );
  } else {
    return <MentoringMatchingPage />;
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
