import { createContext, useContext } from "react";
import useSWR from "swr";
import {
  BusinessArea,
  BusinessAreaResponse,
  BUSINESS_AREAS_ENDPOINT,
} from "./endpoints";

type BusinessAreaContext = {
  isLoading: boolean;
  error?: unknown;
  areas: BusinessArea[];
};

export const BusinessAreaContext = createContext<BusinessAreaContext>({
  isLoading: false,
  areas: [],
});
export const useBusinessAreas = () => useContext(BusinessAreaContext);

type ProviderProps = {
  children: React.ReactNode;
};

export default function BusinessAreaProvider({ children }: ProviderProps) {
  const {
    data: areas,
    error,
    isValidating,
  } = useSWR<BusinessAreaResponse>(BUSINESS_AREAS_ENDPOINT);

  console.log("retrieved areas:", areas, isValidating);

  return (
    <BusinessAreaContext.Provider
      value={{
        areas: areas ?? [],
        error,
        isLoading: !error && !areas,
      }}
    >
      {children}
    </BusinessAreaContext.Provider>
  );
}
