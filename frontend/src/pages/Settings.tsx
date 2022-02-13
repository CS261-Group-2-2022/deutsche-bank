import Topbar from "../components/Topbar";
import { FormInput } from "../components/FormInput";

export default function Signup() {
  return (
    <>
      <Topbar />
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Change Details
            </h2>
          </div>

          <form className="mt-8 space-y-3" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="fname"
                  placeholder="First Name"
                />
                <FormInput
                  id="lastname"
                  name="lastname"
                  type="text"
                  autoComplete="lname"
                  placeholder="Last Name"
                />
              </div>
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
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
