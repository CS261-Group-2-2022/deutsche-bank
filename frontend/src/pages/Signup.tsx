//import { LockClosedIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

type FormInputProps = {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder: string;
};

const FormInput = ({
  id,
  name,
  type,
  autoComplete,
  placeholder,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};

export default function Signup() {
  // const onLoginClick = () => {
  //     fetch('/api/login', {
  //         email:'',
  //     }, {
  //         method: 'POST',
  //     }).then(res => res.json()).then(data => {
  //         // logged in
  //     });
  // };

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
              <FormInput
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
              />
              <FormInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
              />
              <FormInput
                id="retyped-password"
                name="retyped-password"
                type="password"
                autoComplete="current-password"
                placeholder="Retype Password"
              />
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
              />
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {/* <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    aria-hidden="true"
                  />
  </span> */}
                Create Account
              </button>

              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
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
