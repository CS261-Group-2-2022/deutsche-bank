import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";
import { LocationState } from "../utils/location_state";

type LoggedOutPageProps = {
  children: React.ReactNode;
};

/** Page which is only displayed if the user is logged out. If they are logged in, they should be redirected somewhere else */
export default function LoggedOutPage({ children }: LoggedOutPageProps) {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  return !isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to={(location.state as LocationState)?.from ?? "/"} replace />
  );
}
