/* A proxy page which forces log out */
import { Navigate } from "react-router-dom";
import { clearAuthToken } from "../utils/endpoints";

export default function LogoutPage() {
  // Clear the session token
  clearAuthToken();

  return <Navigate to="/login" replace />;
}
