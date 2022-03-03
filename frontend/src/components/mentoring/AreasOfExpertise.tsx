import { PencilIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import {
  FULL_USER_ENDPOINT,
  getAuthToken,
  PROFILE_ENDPOINT,
  SETTINGS_ENDPOINT,
  Skill,
  User,
} from "../../utils/endpoints";
import { useSkills, getSkillFromId } from "../../utils/skills";
import SessionTopicLabel from "../SessionTopicLabel";
import SkillsFuzzyList from "../SkillsFuzzyList";

type AreasOfExpertiseProps = {
  title?: string;
  subHeading?: string;
  user: User;
  canEdit: boolean;
};

const isSkill = (skill: Skill | undefined): skill is Skill => {
  return skill !== undefined;
};

export default function AreasOfExpertise({
  title = "Areas of Expertise",
  subHeading,
  user,
  canEdit,
}: AreasOfExpertiseProps) {
  const { skills } = useSkills();

  const [expertise, setExpertise] = useState<readonly Skill[]>(
    user.expertise
      .map((id) => getSkillFromId(id, skills))
      .filter<Skill>(isSkill)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setExpertise(
      user.expertise
        .map((id) => getSkillFromId(id, skills))
        .filter<Skill>(isSkill)
    );
  }, [skills, user]);

  const updateAreasOfExpertise = async () => {
    setError(undefined);

    const res = await fetch(
      SETTINGS_ENDPOINT.replace("{ID}", user.id.toString()),
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Token ${getAuthToken()}`,
        },
        body: JSON.stringify({ expertise: expertise.map((x) => x.id) }),
      }
    );

    const body = await res.json();

    if (res.ok) {
      setIsEditing(false);
      // Revalidate the caches for profile and users
      mutate(PROFILE_ENDPOINT);
      mutate(FULL_USER_ENDPOINT.replace("{ID}", user.id.toString()));
    } else {
      setError(
        body.expertise?.join(" ") ??
          "An error occured when updating your expertise. Please try again."
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
                isEditing ? updateAreasOfExpertise() : setIsEditing(true)
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
          <SkillsFuzzyList skills={expertise} setSkills={setExpertise} />
        </>
      ) : (
        <div className="flex flex-wrap gap-1 text-gray-800">
          {expertise.length > 0
            ? expertise.map(
                (expertise) =>
                  expertise && (
                    <SessionTopicLabel
                      key={expertise.id}
                      name={expertise.name}
                    />
                  )
              )
            : "No current expertise"}
        </div>
      )}
    </div>
  );
}
