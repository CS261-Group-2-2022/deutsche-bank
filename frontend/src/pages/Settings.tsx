import Topbar from "../components/Topbar";
import { FormInput } from "../components/FormInput";
import { useEffect, useRef, useState } from "react";
import {
  BusinessArea,
  CHANGE_PASSWORD_ENDPOINT,
  FULL_USER_ENDPOINT,
  getAuthToken,
  PROFILE_ENDPOINT,
  Skill,
} from "../utils/endpoints";
import { useUser } from "../utils/authentication";
import { useSkills } from "../utils/skills";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import SkillsFuzzyList from "../components/SkillsFuzzyList";
import FormDropdown from "../components/FormDropdown";
import { getAreaFromId, useBusinessAreas } from "../utils/business_area";
import { mutate } from "swr";
import { LoadingButton } from "../components/LoadingButton";

export default function Settings() {
  const { areas } = useBusinessAreas();
  const { skills } = useSkills();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  const [businessArea, setBusinessArea] = useState<BusinessArea | undefined>(
    user ? getAreaFromId(user.business_area, areas) : undefined
  );
  const [expertise, setExpertise] = useState<readonly Skill[]>(
    (user?.expertise
      ?.map((id) => skills.find((skill) => skill.id === id))
      .filter((x) => x !== undefined) as Skill[]) ?? []
  );
  const [interests, setInterests] = useState<readonly Skill[]>(
    (user?.interests
      ?.map((id) => skills.find((skill) => skill.id === id))
      .filter((x) => x !== undefined) as Skill[]) ?? []
  );
  const passwordStrength = useRef(0);

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | undefined
  >();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [retypedPasswordError, setRetypedPasswordError] = useState<
    string | undefined
  >();
  const [businessAreaError, setBusinessAreaError] = useState<
    string | undefined
  >();
  const [expertiseError, setExpertiseError] = useState<string | undefined>();
  const [interestsError, setInterestsError] = useState<string | undefined>();

  // If areas and skills get updated, update the values
  useEffect(() => {
    setBusinessArea(
      user ? getAreaFromId(user.business_area, areas) : undefined
    );
    setExpertise(
      (user?.expertise
        ?.map((id) => skills.find((skill) => skill.id === id))
        .filter((x) => x !== undefined) as Skill[]) ?? []
    );
    setInterests(
      (user?.interests
        ?.map((id) => skills.find((skill) => skill.id === id))
        .filter((x) => x !== undefined) as Skill[]) ?? []
    );
  }, [areas, skills, user]);

  const clearErrors = () => {
    setFirstNameError(undefined);
    setLastNameError(undefined);
    setPasswordError(undefined);
    setRetypedPasswordError(undefined);
    setBusinessAreaError(undefined);
    setExpertiseError(undefined);
    setInterestsError(undefined);
    setCurrentPasswordError(undefined);
  };

  const sendSettingsUpdateRequest = async () => {
    setIsLoading(true);
    clearErrors();

    if (!user) return;

    // Check business area is set
    if (!businessArea) {
      setBusinessAreaError("You must select a business area");
      setIsLoading(false);
      return false;
    }

    const res = await fetch(PROFILE_ENDPOINT, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        expertise: expertise.map((skill) => skill.id),
        interests: interests.map((skill) => skill.id),
        // password : password,
        business_area: businessArea.id,
      }),
    });

    const body = await res.json();

    if (res.ok) {
      // Revalidate caches for profile information
      mutate(PROFILE_ENDPOINT);
      mutate(FULL_USER_ENDPOINT.replace("{ID}", user.id.toString()));

      // TODO: better feedback?
      alert("Settings Updated");
    } else {
      setFirstNameError(body.first_name?.join(" "));
      setLastNameError(body.last_name?.join(" "));
      setBusinessAreaError(body.business_area?.join(" "));
      setExpertiseError(body.expertise?.join(" "));
      setInterestsError(body.interests?.join(" "));
    }

    setIsLoading(false);
  };

  const updatePassword = async () => {
    setIsLoadingPassword(true);
    clearErrors();

    if (!user) return;

    // Check password and retyped password are equivalent
    if (password !== retypedPasssword) {
      setRetypedPasswordError("Passwords do not match");
      setIsLoading(false);
      return false;
    }

    // Check the score is high enough
    if (password !== "" && passwordStrength.current <= 2) {
      setPasswordError("This password is too weak, try something stronger.");
      setIsLoading(false);
      return false;
    }

    const res = await fetch(CHANGE_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        password: currentPassword,
        new_password: password,
      }),
    });

    if (res.ok) {
      // TODO: better feedback?
      alert("Password Updated");
    } else {
      const body = await res.json();
      setCurrentPasswordError(
        body.password?.join(" ") ?? body.non_field_errors?.join(" ")
      );
      setPasswordError(body.new_password?.join(" "));
    }

    setIsLoadingPassword(false);
  };

  return (
    <>
      <Topbar />
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-5">
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
                  error={firstNameError}
                />
                <FormInput
                  id="lastname"
                  name="Last name"
                  type="text"
                  placeholder="Last Name"
                  autoComplete="lname"
                  text={lastName}
                  onChange={setLastName}
                  error={lastNameError}
                />
              </div>
              <FormDropdown
                title="Business Area"
                options={areas}
                selected={businessArea}
                setSelected={setBusinessArea}
                error={businessAreaError}
                placeholder="Select an area"
              />
              <SkillsFuzzyList
                title="Areas of Expertise"
                skills={expertise}
                setSkills={setExpertise}
              />
              {expertiseError && (
                <div className="block text-sm m-1 font-medium text-red-700">
                  {expertiseError}
                </div>
              )}
              <SkillsFuzzyList
                title="Areas of Interest"
                skills={interests}
                setSkills={setInterests}
              />
              {interestsError && (
                <div className="block text-sm m-1 font-medium text-red-700">
                  {interestsError}
                </div>
              )}
            </div>

            <div>
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </LoadingButton>
            </div>
          </form>

          <hr />

          <form
            className="mt-8 space-y-3"
            action="#"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              updatePassword();
            }}
          >
            <div className="rounded-md shadow-sm space-y-3">
              <FormInput
                id="current-password"
                name="Current Password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                text={currentPassword}
                onChange={setCurrentPassword}
                error={currentPasswordError}
                required
                hideRequiredAsterisk
              />
              <FormInput
                id="password"
                name="New Password"
                type="password"
                placeholder="Password"
                autoComplete="false"
                text={password}
                onChange={setPassword}
                error={passwordError}
                required
                hideRequiredAsterisk
              />

              <FormInput
                id="retyped-password"
                name="Retype New Password"
                type="password"
                placeholder="Retype Password"
                autoComplete="current-password"
                text={retypedPasssword}
                onChange={setRetypedPassword}
                error={retypedPasswordError}
                required
                hideRequiredAsterisk
              />
              <PasswordStrengthIndicator
                password={password}
                otherInputs={[firstName, lastName]}
                updateResult={(score) => (passwordStrength.current = score)}
              />
            </div>

            <div>
              <LoadingButton
                type="submit"
                isLoading={isLoadingPassword}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Password
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
