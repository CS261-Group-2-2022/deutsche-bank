import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import FormDropdown from "../components/FormDropdown";
import { FormInput } from "../components/FormInput";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { useUser } from "../utils/authentication";
import { useBusinessAreas } from "../utils/business_area";
import {
  BusinessArea,
  RegisterBody,
  RegisterSuccess,
  setAuthToken,
  SIGNUP_ENDPOINT,
} from "../utils/endpoints";
import { LocationState } from "../utils/location_state";

/** Verifies whether a login response is succesful or not (and type guards the body) */
const isRegisterSuccess = (
  res: Response,
  body: RegisterBody
): body is RegisterSuccess => {
  return res.ok;
};

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const { areas } = useBusinessAreas();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  const [businessArea, setBusinessArea] = useState<BusinessArea | undefined>(
    areas[0]
  );

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [retypedPasswordError, setRetypedPasswordError] = useState<
    string | undefined
  >();
  const [businessAreaError, setBusinessAreaError] = useState<
    string | undefined
  >();
  const [overallError, setOverallError] = useState<string | undefined>();

  /** Navigates back to the page we originated from, or the home page if we don't know where from */
  const navigateBack = () =>
    navigate((location.state as LocationState)?.from?.pathname ?? "/");

  // Effect which runs if we have a user logged in.
  // If we are logged in, we need to redirect to where we came from, as we don't need to signup again
  useEffect(() => {
    if (isLoggedIn) {
      navigateBack();
    }
  }, [isLoggedIn]);

  const clearErrors = () => {
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setRetypedPasswordError(undefined);
    setBusinessAreaError(undefined);
    setOverallError(undefined);
  };

  const sendRegisterRequest = async () => {
    // Check password and retyped password are equivalent
    if (password != retypedPasssword) {
      setRetypedPasswordError("Passwords do not match");
      return false;
    } else {
      setRetypedPasswordError(undefined);
    }

    // Check business area is set
    if (!businessArea) {
      setBusinessAreaError("You must select a business area");
      return false;
    }

    const res = await fetch(SIGNUP_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        business_area: businessArea.id,
      }),
    });

    clearErrors();
    const body: RegisterBody = await res.json();

    if (isRegisterSuccess(res, body)) {
      // Succesfully logged in
      setAuthToken(body.token, false);
      window.open("/", "_self");
    } else {
      setFirstNameError(body.first_name?.join(" "));
      setLastNameError(body.last_name?.join(" "));
      setEmailError(body.email?.join(" "));
      setPasswordError(body.password?.join(" "));
      setBusinessAreaError(body.business_area?.join(" "));
      setOverallError(body.non_field_errors?.join(" "));
    }
  };

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              sendRegisterRequest();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  id="firstname"
                  name="First Name"
                  type="text"
                  autoComplete="fname"
                  placeholder="First Name"
                  text={firstName}
                  onChange={setFirstName}
                  error={firstNameError}
                  required
                />
                <FormInput
                  id="lastname"
                  name="Last Name"
                  type="text"
                  autoComplete="lname"
                  placeholder="Last Name"
                  text={lastName}
                  onChange={setLastName}
                  error={lastNameError}
                  required
                />
              </div>
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
              />
              <FormInput
                id="retyped-password"
                name="Retype Password"
                type="password"
                autoComplete="current-password"
                placeholder="Retype Password"
                text={retypedPasssword}
                onChange={setRetypedPassword}
                error={retypedPasswordError}
                required
              />
              <PasswordStrengthIndicator
                password={password}
                otherInputs={[firstName, lastName, email]}
              />
              <FormDropdown
                title="Business Area"
                options={areas}
                selected={businessArea}
                setSelected={setBusinessArea}
                error={businessAreaError}
                placeholder="Select an area"
              />
            </div>

            <div className="space-y-2">
              {overallError && (
                <div className="block text-sm m-1 font-medium text-red-700">
                  {overallError}
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>

              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link
                  to="/login"
                  state={location.state}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  log in to an existing account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
