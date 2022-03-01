import { PencilIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { mutate } from "swr";
import {
  FULL_USER_ENDPOINT,
  getAuthToken,
  PROFILE_ENDPOINT,
  SETTINGS_ENDPOINT,
  User,
} from "../../utils/endpoints";
import { FormTextArea } from "../FormTextarea";

type InterestsDescriptionProps = {
  title?: string;
  subHeading?: string;
  user: User;
  canEdit: boolean;
};

export default function InterestsDescription({
  title = "Interests Description",
  subHeading,
  user,
  canEdit,
}: InterestsDescriptionProps) {
  const [bio, setBio] = useState(user.bio ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const updateInterestsDescription = async () => {
    setError(undefined);

    const res = await fetch(
      SETTINGS_ENDPOINT.replace("{ID}", user.id.toString()),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({
          bio, // TODO: backend?
        }),
      }
    );

    const body = await res.json();

    if (res.ok) {
      setIsEditing(false);
      // Revalidate the caches for profile and users
      mutate(PROFILE_ENDPOINT);
      mutate(FULL_USER_ENDPOINT.replace("{ID}", user.id.toString()));
    } else {
      // TODO: error from backend
      setError(
        body.bio?.join(" ") ??
          "An error occured when updating your interests description. Please try again."
      );
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="flex text-xl font-bold gap-2">
          {title}
          {canEdit && (
            <button
              className={`ml-2 px-4 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ${
                isEditing
                  ? " bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200"
                  : " bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200"
              }`}
              onClick={() =>
                isEditing ? updateInterestsDescription() : setIsEditing(true)
              }
            >
              {isEditing ? (
                <>Save</>
              ) : (
                <>
                  <PencilIcon className="w-5 h-5 mr-1" />
                  Edit
                </>
              )}
            </button>
          )}
        </h3>
        {subHeading && <h5 className="text-sm text-gray-600">{subHeading}</h5>}
      </div>

      {canEdit && isEditing ? (
        <>
          {error && (
            <div className="block text-sm m-1 font-medium text-red-700">
              {error}
            </div>
          )}
          <FormTextArea
            id="notes"
            name=""
            placeholder="Enter a description about your interests. This will be used to advise your mentoring pairings."
            text={bio}
            onChange={setBio}
          />
        </>
      ) : (
        <p className="text-gray-800">
          {bio === "" ? "No interests description set" : bio}
        </p>
      )}
    </div>
  );
}
