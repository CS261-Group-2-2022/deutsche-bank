import { MouseEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useUser } from "../utils/authentication";

export default function Error404() {
  const { user } = useUser();
  const navigate = useNavigate();

  // Navigate back one step in history
  const navigateBack: MouseEventHandler = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <>
      {user && <Topbar />}

      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center mx-auto z-20">
          <h1 className="text-3xl block font-extrabold text-black sm:text-5xl">
            Page not found
          </h1>
          <p className="text-l mt-4 max-w-md mx-auto text-gray-400">
            The page you were looking for could not be found
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
    </>
  );
}
