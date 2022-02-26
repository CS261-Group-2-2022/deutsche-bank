import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";

type ProtectedPageProps = {
  children: React.ReactNode;
};

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isLoggedIn, isLoading } = useUser();
  const location = useLocation();

  // If we are still loading the information, then we temporarily render nothing
  if (isLoading) {
    return <></>;
  }

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
