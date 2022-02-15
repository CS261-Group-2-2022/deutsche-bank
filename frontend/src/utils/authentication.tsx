import { createContext, useContext } from "react";
import useSWR from "swr";
import { ProfileSuccess, PROFILE_ENDPOINT, User } from "./endpoints";

type UserContext = {
  user?: User;
  error?: unknown;
  isLoading: boolean;
};

export const UserContext = createContext<UserContext>({ isLoading: false });
export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const { data: user, error } = useSWR<ProfileSuccess>(PROFILE_ENDPOINT);

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        isLoading: !error && !user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
