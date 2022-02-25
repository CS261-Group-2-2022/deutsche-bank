import { createContext, useContext } from "react";
import useSWR from "swr";
import { Skill, SkillsResponse, SKILLS_ENDPOINT } from "./endpoints";

type SkillsContext = {
  isLoading: boolean;
  error?: unknown;
  skills: Skill[];
};

export const SkillsContext = createContext<SkillsContext>({
  isLoading: false,
  skills: [],
});
export const useSkills = () => useContext(SkillsContext);

type ProviderProps = {
  children: React.ReactNode;
};

export default function SkillsProvider({ children }: ProviderProps) {
  const { data: skills, error } = useSWR<SkillsResponse>(SKILLS_ENDPOINT);

  return (
    <SkillsContext.Provider
      value={{
        skills: skills ?? [],
        error,
        isLoading: !error && !skills,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
}
