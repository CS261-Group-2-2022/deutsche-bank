import { createContext, useContext } from "react";
import useSWR from "swr";

type User = {
  name: string;
  email: string;
  business_area: string;
};

type UserContext = {
  user?: User;
  error?: unknown;
  isLoading: boolean;
};

const TEMP_USER_PROFILE = {
  name: "John Doe",
  email: "john.doe@example.com",
  business_area: "Trading",
};

export const UserContext = createContext<UserContext>({
  user: TEMP_USER_PROFILE,
  isLoading: false,
});
export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const { data: user, error } = useSWR(`/api/profile/me`);

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
