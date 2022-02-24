import Topbar from "../components/Topbar";
import { FormInput } from "../components/FormInput";
import { useState } from "react";
import { RegisterBody, RegisterSuccess, setAuthToken, SETTINGS_ENDPOINT, SIGNUP_ENDPOINT } from "../utils/endpoints";
import { useUser } from "../utils/authentication";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  // const [businessArea, setBusinessArea] = useState("");

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [retypedPasswordError, setRetypedPasswordError] = useState<
    string | undefined
  >();
  // const [businessAreaError, setBusinessAreaError] = useState<
  //   string | undefined
  // >();

  const { user } = useUser();

  const clearErrors = () => {
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setRetypedPasswordError(undefined);
    // setBusinessAreaError(undefined);
  };

  const sendSettingsUpdateRequest = async () => {
    console.log("useuser");
    console.log(user);

    // Check password and retyped password are equivalent
    if (password != retypedPasssword) {
      setRetypedPasswordError("Passwords do not match");
      console.log("Passwords don't match");
      return false;
    } else {
      setRetypedPasswordError(undefined);
    }

    // Check business area is set
    // if (!businessArea) {
    //   setBusinessAreaError("You must select a business area");
    //   return false;
    // }

    const res = await fetch(SETTINGS_ENDPOINT.replace("{ID}",user?.id.toString() ?? "1"), {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        // password : password, 
        // business_area: businessArea,
      }),// TODO currently you are not able to change the password with this endpoint, will fix this shortly
    });

    clearErrors();
    // const body: RegisterBody = await res.json();

    // const isRegisterSuccess = (
    //   res: Response,
    //   body: RegisterBody
    // ): body is RegisterSuccess => {
    //   return res.ok;
    // };

    // if (isRegisterSuccess(res, body)) {
    //   // Succesfully logged in
    //   console.log("Succesfully logged in");
    //   setAuthToken(body.token, false);
    // } else {
    //   setFirstNameError(body.first_name?.join(" "));
    //   setLastNameError(body.last_name?.join(" "));
    //   setEmailError(body.email?.join(" "));
    //   setPasswordError(body.password?.join(" "));
    //   // setBusinessAreaError(body.business_area?.join(" "));
    // }
  };

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

          <form className="mt-8 space-y-3" action="#" method="POST" onSubmit={(e) => {
            console.log("Submiting...")
              e.preventDefault();
              sendSettingsUpdateRequest();
            }}>
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
                id="password"
                name="new password"
                type="password"
                placeholder="Password"
                text={password}
                onChange={setPassword}
              />
              <FormInput
                id="retyped-password"
                name="retype new password"
                type="password"
                placeholder="Retype Password"
                text={retypedPasssword}
                onChange={setRetypedPassword}
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
