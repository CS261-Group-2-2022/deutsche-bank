import { useEffect, useState } from "react";
import { mutate } from "swr";
import {
  FULL_USER_ENDPOINT,
  getAuthToken,
  PROFILE_ENDPOINT,
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

  useEffect(() => {
    if (expertise.length === 0) {
      setExpertise(
        user.expertise
          .map((id) => getSkillFromId(id, skills))
          .filter<Skill>(isSkill)
      );
    }
  }, [skills, user]);

  const updateAreasOfExpertise = async (skills: readonly Skill[]) => {
    const res = await fetch(PROFILE_ENDPOINT, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({ expertise: skills.map((x) => x.id) }),
    });

    const body = await res.json();

    if (res.ok) {
      // Revalidate the caches for profile and users
      setExpertise(skills);
      mutate(PROFILE_ENDPOINT);
      mutate(FULL_USER_ENDPOINT.replace("{ID}", user.id.toString()));
      return true;
    } else {
      return (
        body.expertise?.join(" ") ??
        "An error occured when updating your expertise. Please try again."
      );
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="flex text-xl font-bold gap-2">{title}</h3>

        {subHeading && <h5 className="text-sm text-gray-600">{subHeading}</h5>}
      </div>

      {canEdit ? (
        <>
          <SkillsFuzzyList
            skills={expertise}
            setSkills={updateAreasOfExpertise}
          />
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
