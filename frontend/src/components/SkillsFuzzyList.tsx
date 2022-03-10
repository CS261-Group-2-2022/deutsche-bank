import { useState } from "react";
import Creatable from "react-select/creatable";
import {
  components,
  OnChangeValue,
  MultiValueGenericProps,
} from "react-select";
import { useSkills } from "../utils/skills";
import {
  CreateSkillResponse,
  CreateSkillSuccess,
  getAuthToken,
  Skill,
  SKILLS_ENDPOINT,
} from "../utils/endpoints";
import { colourFromName } from "../utils/colours";
import { mutate } from "swr";

const MultiValueContainer = (props: MultiValueGenericProps<Skill, true>) => (
  <components.MultiValueContainer
    {...props}
    innerProps={{
      className: `flex rounded-lg ${colourFromName(props.data.name)} mr-1`,
    }}
  />
);

const isCreateSuccess = (
  res: Response,
  body: CreateSkillResponse
): body is CreateSkillSuccess => {
  return res.ok;
};

interface CreateableSkill extends Skill {
  __isNew?: boolean;
}

const createOption = (name: string, creating?: boolean) => {
  return { id: Math.random(), name, __isNew: creating };
};

const toTitleCase = (input: string) =>
  input
    .toLowerCase()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

type SkillsFuzzyListProps = {
  title?: string;
  skills: readonly CreateableSkill[];
  setSkills: (skills: readonly Skill[]) => unknown;
};

export default function SkillsFuzzyList({
  title,
  skills,
  setSkills,
}: SkillsFuzzyListProps) {
  const { skills: allSkills } = useSkills();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Update the overall skills on change
  const onChange = (newValue: OnChangeValue<CreateableSkill, true>) =>
    setSkills(newValue);

  // If we have been asked to create a new option, send it to the backend
  const onCreateOption = async (input: string) => {
    setError(undefined);
    setIsLoading(true);

    const titledInput = toTitleCase(input);
    const res = await fetch(SKILLS_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
      },
      body: JSON.stringify({
        name: titledInput,
      }),
    });

    // Clear any existing errors
    const body: CreateSkillResponse = await res.json();

    if (isCreateSuccess(res, body)) {
      const newSkill = body;

      // Update the list of available skills
      mutate(SKILLS_ENDPOINT);
      //   setOptions([...options, newSkill]);
      setSkills([...skills, newSkill]);
      setIsLoading(false);
    } else {
      setError(body.name?.join(" "));
      setIsLoading(false);
    }
  };

  return (
    <div>
      {title && (
        <div className="flex flex-row text-sm mb-1 font-medium text-gray-700">
          {title}
        </div>
      )}
      <Creatable
        isClearable
        isMulti
        isDisabled={isLoading}
        isLoading={isLoading}
        onChange={onChange}
        onCreateOption={onCreateOption}
        options={allSkills}
        value={skills}
        getOptionLabel={(option) =>
          option.__isNew ? `Create "${option.name}"` : option.name
        }
        getOptionValue={(option) => option.name}
        getNewOptionData={(input) => createOption(toTitleCase(input), true)}
        components={{ MultiValueContainer }}
        formatCreateLabel={(input) => `Create "${input}"`}
      />
      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
