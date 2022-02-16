import { createContext, useContext } from "react";
import useSWR from "swr";
import { ProfileSuccess, PROFILE_ENDPOINT, User } from "./endpoints";

type UserContext = {
  user?: User;
  error?: unknown;
  isLoading: boolean;
  isLoggedIn: boolean;
};

export const UserContext = createContext<UserContext>({
  isLoading: false,
  isLoggedIn: false,
});
export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const { data: user, error } = useSWR<ProfileSuccess>(PROFILE_ENDPOINT);

  return (
    <UserContext.Provider
      value={{
        user: !error ? user : undefined,
        error,
        isLoading: !error && !user,
        isLoggedIn: !error && user !== undefined,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
