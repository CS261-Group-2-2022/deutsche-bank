import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";

/** Page wrapper to protect specific page routes.
 * If the user is not authenticated, they will be redirected to login
 */
export default function ProtectedPage() {
  const { isLoggedIn, isLoading } = useUser();
  const location = useLocation();

  // If we are still loading the information, then we temporarily render nothing
  if (isLoading) {
    return <></>;
  }

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
