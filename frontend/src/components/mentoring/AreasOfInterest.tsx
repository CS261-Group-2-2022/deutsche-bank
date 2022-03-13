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

type AreasOfInterestProps = {
  title?: string;
  subHeading?: string;
  user: User;
  canEdit: boolean;
};

const isSkill = (skill: Skill | undefined): skill is Skill => {
  return skill !== undefined;
};

export default function AreasOfInterest({
  title = "Areas of Interest",
  subHeading,
  user,
  canEdit,
}: AreasOfInterestProps) {
  const { skills } = useSkills();

  const [interests, setInterests] = useState<readonly Skill[]>(
    user.interests
      .map((id) => getSkillFromId(id, skills))
      .filter<Skill>(isSkill)
  );

  useEffect(() => {
    if (interests.length === 0) {
      setInterests(
        user.interests
          .map((id) => getSkillFromId(id, skills))
          .filter<Skill>(isSkill)
      );
    }
  }, [skills, user]);

  const updateAreasOfInterest = async (skills: readonly Skill[]) => {
    const res = await fetch(PROFILE_ENDPOINT, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({ interests: skills.map((x) => x.id) }),
    });

    const body = await res.json();

    if (res.ok) {
      // Revalidate the caches for profile and users
      setInterests(skills);
      mutate(PROFILE_ENDPOINT);
      mutate(FULL_USER_ENDPOINT.replace("{ID}", user.id.toString()));
      return true;
    } else {
      return (
        body.expertise?.join(" ") ??
        "An error occured when updating your interests. Please try again."
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
        <SkillsFuzzyList skills={interests} setSkills={updateAreasOfInterest} />
      ) : (
        <div className="flex flex-wrap gap-1 text-gray-800">
          {interests.length > 0
            ? interests.map(
                (interest) =>
                  interest && (
                    <SessionTopicLabel key={interest.id} name={interest.name} />
                  )
              )
            : "No current interests"}
        </div>
      )}
    </div>
  );
}
