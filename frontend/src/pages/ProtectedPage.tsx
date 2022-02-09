import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../utils/authentication";

type ProtectedPageProps = {
  children: React.ReactNode;
};

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { user } = useUser();
  const location = useLocation();

  return user !== undefined ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
