/* Logout page */
import { Link } from "react-router-dom";
import { mutate } from "swr";
import { clearAuthToken, PROFILE_ENDPOINT } from "../utils/endpoints";

export default function LogoutPage() {
  // Clear the session token
  clearAuthToken();

  // Force a cache revalidation
  mutate(PROFILE_ENDPOINT);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center mx-auto z-20">
        <h1 className="text-3xl block font-bold text-black sm:text-5xl">
          You have logged out
        </h1>
        <p className="mt-5 text-center text-xl text-gray-600">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
            replace
          >
            Log back in
          </Link>
        </p>
      </div>
    </div>
  );
}
