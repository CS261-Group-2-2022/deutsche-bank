import { useState } from "react";
import { Link } from "react-router-dom";
import FormDropdown from "../components/FormDropdown";
import { FormInput } from "../components/FormInput";

// TODO: retrieve these from the backend
const BUSINESS_AREAS = [
  {
    id: 1,
    text: "Trading",
  },
  {
    id: 2,
    text: "Sales",
  },
  {
    id: 3,
    text: "Operations",
  },
  {
    id: 3,
    text: "Engineering",
  },
  {
    id: 4,
    text: "Research",
  },
];

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  const [businessArea, setBusinessArea] = useState(BUSINESS_AREAS[0]);

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
          </div>

          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="fname"
                  placeholder="First Name"
                  text={firstName}
                  onChange={setFirstName}
                />
                <FormInput
                  id="lastname"
                  name="lastname"
                  type="text"
                  autoComplete="lname"
                  placeholder="Last Name"
                  text={lastName}
                  onChange={setLastName}
                />
              </div>
              <FormInput
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                text={email}
                onChange={setEmail}
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                text={password}
                onChange={setPassword}
              />
              <FormInput
                id="retyped-password"
                name="retyped-password"
                type="password"
                autoComplete="current-password"
                placeholder="Retype Password"
                text={retypedPasssword}
                onChange={setRetypedPassword}
              />
              <FormDropdown
                title="Business Area"
                options={BUSINESS_AREAS}
                selected={businessArea}
                setSelected={setBusinessArea}
              />
            </div>

            <div className="space-y-2">
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
