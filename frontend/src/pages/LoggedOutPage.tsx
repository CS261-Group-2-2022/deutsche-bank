import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";
import { LocationState } from "../utils/location_state";

/** Page which is only displayed if the user is logged out. If they are logged in, they should be redirected somewhere else */
export default function LoggedOutPage() {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  return !isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to={(location.state as LocationState)?.from ?? "/"} replace />
  );
}
