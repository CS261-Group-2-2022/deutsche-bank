import Topbar from "../components/Topbar";
import { FormInput } from "../components/FormInput";
import { useState } from "react";
import {
  RegisterBody,
  RegisterSuccess,
  setAuthToken,
  SETTINGS_ENDPOINT,
  SIGNUP_ENDPOINT,
  Skill,
  SKILLS_ENDPOINT,
} from "../utils/endpoints";
import { useUser } from "../utils/authentication";
import FormMultiSelect from "../components/FormMultiSelect";
import { useSkills } from "../utils/skills";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

export default function Settings() {
  const { skills } = useSkills();
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  const [assignedSkills, setAssignedSkills] = useState<Skill[]>(
    (user?.expertise
      ?.map((id) => skills.find((skill) => skill.id === id))
      .filter((x) => x !== undefined) as Skill[]) ?? []
  );
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
  const [skillsError, setSkillsError] = useState<string | undefined>();

  const clearErrors = () => {
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setRetypedPasswordError(undefined);
    // setBusinessAreaError(undefined);
    setSkillsError(undefined);
  };

  const sendSettingsUpdateRequest = async () => {
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

    const skillIds = assignedSkills.map((skillId) => skillId.id);

    const res = await fetch(
      SETTINGS_ENDPOINT.replace("{ID}", user?.id.toString() ?? "1"),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          expertise: skillIds,
          // password : password,
          // business_area: businessArea,
        }), // TODO currently you are not able to change the password with this endpoint, will fix this shortly
      }
    );

    clearErrors();
    if (res.ok) {
      alert("Settings Updated");
    }
  };

  return (
    <>
      <Topbar />
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-1 text-center text-3xl font-extrabold text-gray-900">
              Change Details
            </h2>
          </div>

          <form
            className="mt-8 space-y-3"
            action="#"
            method="POST"
            onSubmit={(e) => {
              console.log("Submiting...");
              e.preventDefault();
              sendSettingsUpdateRequest();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  id="firstname"
                  name="First name"
                  type="text"
                  placeholder="First Name"
                  autoComplete="fname"
                  text={firstName}
                  onChange={setFirstName}
                />
                <FormInput
                  id="lastname"
                  name="Last name"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="lname"
                  text={lastName}
                  onChange={setLastName}
                />
              </div>
              <FormMultiSelect
                title="Areas of Expertise"
                options={skills}
                selected={assignedSkills}
                setSelected={setAssignedSkills}
                error={skillsError}
                placeholder="Select your areas of expertise"
                hashColouredLabels
              />
              <FormInput
                id="password"
                name="New Password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                text={password}
                onChange={setPassword}
              />
              <PasswordStrengthIndicator
                password={password}
                otherInputs={[firstName, lastName]}
              />
              <FormInput
                id="retyped-password"
                name="Retype New Password"
                type="password"
                placeholder="Retype Password"
                autoComplete="current-password"
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
