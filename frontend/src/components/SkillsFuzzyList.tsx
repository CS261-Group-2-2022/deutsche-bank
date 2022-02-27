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

// const MultiValueRemove = (props: MultiValueRemoveProps<Skill, true>) => (
//   <components.MultiValueRemove
//     {...props}
//     innerProps={{ className: "rounded-r-lg hover:bg-red-200 pr-1" }}
//   />
// );

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
  skills: Skill[];
  setSkills: (skills: Skill[]) => never;
};

export default function SkillsFuzzyList() {
  const { skills } = useSkills();
  //   const [options, setOptions] = useState<CreateableSkill[]>(skills);

  const [value, setValue] = useState<readonly CreateableSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (newValue: OnChangeValue<CreateableSkill, true>) => {
    setValue(newValue);
  };

  const onCreateOption = async (input: string) => {
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
      setValue([...value, newSkill]);
      setIsLoading(false);
    } else {
      //   setSessionTitleError(body.name?.join(" "));
      //   setLocationError(body.location?.join(" "));
      //   setVirtualLinkError(body.virtual_link?.join(" "));
      //   setDescriptionError(body.description?.join(" "));
      //   setCapacityError(body.capacity?.join(" "));
      //   setDatetimeError(body.date?.join(" "));
      //   setOverallError(body.non_field_errors?.join(" "));
      //   setSkillsError(body.skills?.join(" "));
      // todo: ERRORS?
    }
  };

  return (
    <Creatable
      isClearable
      isMulti
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={onChange}
      onCreateOption={onCreateOption}
      options={skills}
      value={value}
      getOptionLabel={(option) =>
        option.__isNew ? `Create "${option.name}"` : option.name
      }
      getOptionValue={(option) => option.name}
      getNewOptionData={(input) => createOption(toTitleCase(input), true)}
      components={{ MultiValueContainer }}
      formatCreateLabel={(input) => `Create "${input}"`}
    />
  );
}
