import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";

type ProtectedPageProps = {
  children: React.ReactNode;
};

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
