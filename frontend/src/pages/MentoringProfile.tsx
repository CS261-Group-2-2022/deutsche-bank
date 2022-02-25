import { Navigate, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function MentoringProfile() {
  const { user: viewingUser } = useParams();

  // If there is no parameter for the viewing user (which can't actually ever happen), redirect to your profile
  if (!viewingUser) {
    return <Navigate to="/mentoring/me" />;
  }

  const isViewingOwnProfile = viewingUser === "me";

  // Steps we need to take:
  // If isViewingOwnProfile, and do not currently have a mentor, then show "search for new mentor" page.
  // If isViewingOwnProfile, and has a mentor, then show profile
  // If not isViewingOwnProfile, and user has permission to view the profile (i.e. is mentor), then show profile
  // If not isViewingOwnProfile, and user does not have permission to view, then show forbidden message.

  return (
    <>
      <Topbar />
      <h1>{viewingUser}</h1>
    </>
  );
}
