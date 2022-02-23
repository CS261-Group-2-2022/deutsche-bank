import { LockClosedIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import { useUser } from "../utils/authentication";
import {
  LoginBody,
  LoginSuccess,
  LOGIN_ENDPOINT,
  setAuthToken,
} from "../utils/endpoints";
import { LocationState } from "../utils/location_state";

/** Verifies whether a login response is succesful or not (and type guards the body) */
const isLoginSuccess = (
  res: Response,
  body: LoginBody
): body is LoginSuccess => {
  return res.ok;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  /** Navigates back to the page we originated from, or the home page if we don't know where from */
  const navigateBack = () =>
    navigate((location.state as LocationState)?.from?.pathname ?? "/");

  // Effect which runs if we have a user logged in.
  // If we are logged in, we need to redirect to where we came from, as we don't need to login again
  useEffect(() => {
    if (isLoggedIn) {
      navigateBack();
    }
  }, [isLoggedIn]);

  // Function to send off a login request, and handle the response from it
  const sendLoginRequest = async () => {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const body: LoginBody = await res.json();

    if (isLoginSuccess(res, body)) {
      // Succesfully logged in
      window.open("/", "_self");
      setAuthToken(body.token, rememberMe);
    } else {
      setEmailError(body.email?.join(" "));
      setPasswordError(body.password?.join(" "));

      // If there is an overall error, then display that
      if (body.non_field_errors) {
        // Make the email/password boxes highlight red
        if (!body.email) {
          setEmailError(body.non_field_errors.join(" "));
        } else {
          setPasswordError(body.non_field_errors.join(" "));
        }
      }
    }
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendLoginRequest();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-3">
              <FormInput
                id="email-address"
                name="Email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                text={email}
                onChange={setEmail}
                error={emailError}
                required
                hideRequiredAsterisk
              />
              <FormInput
                id="password"
                name="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                text={password}
                onChange={setPassword}
                error={passwordError}
                required
                hideRequiredAsterisk
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
              <p className="text-center font-semibold">or</p>
              <Link
                to="/signup"
                state={location.state}
                className="flex justify-center w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 focus:ring-gray-500 focus:ring-offset-gray-200 text-gray-700 transition ease-in duration-100 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
