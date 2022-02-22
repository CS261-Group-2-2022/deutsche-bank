export const LOGIN_ENDPOINT = "http://localhost:8000/api/v1/auth/login/";
export const SIGNUP_ENDPOINT = "http://localhost:8000/api/v1/auth/register/";
export const PROFILE_ENDPOINT = "http://localhost:8000/api/v1/auth/profile/";
export const BUSINESS_AREAS_ENDPOINT = "http://localhost:8000/api/v1/area/";
export const LIST_GROUP_SESSIONS_ENDPOINT =
  "http://localhost:8000/api/v1/session/";

/** Retrieves a stored session token */
export const getAuthToken = () => {
  return (
    window.sessionStorage.getItem("token") ??
    window.localStorage.getItem("token")
  );
};

/**
 * Stores a new session token
 * @param remember Whether the token should be remembered when the user closes the browser
 */
export const setAuthToken = (token: string, remember: boolean) => {
  // Clear old tokens
  clearAuthToken();

  if (remember) {
    window.localStorage.setItem("token", token);
  } else {
    window.sessionStorage.setItem("token", token);
  }
};

export const clearAuthToken = () => {
  window.sessionStorage.removeItem("token");
  window.localStorage.removeItem("token");
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  mentor_intent: boolean;
  business_area: number;
  mentorship: null;
  interests: string[];
  expertise: string[];
};

// Login
export type LoginSuccess = {
  user: User;
  token: string;
};

export type LoginError = {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
};

export type LoginBody = LoginSuccess | LoginError;

// Register
export type RegisterSuccess = {
  user: User;
  token: string;
};

export type RegisterError = {
  email?: string[];
  first_name?: string[];
  last_name?: string[];
  password?: string[];
  business_area?: string[];
  non_field_errors?: string[];
};

export type RegisterBody = RegisterSuccess | RegisterError;

// Profile
export type ProfileSuccess = User;

export type ProfileError = {
  detail: string;
};

export type ProfileResponse = ProfileSuccess | ProfileError;

// Business Areas
export type BusinessArea = {
  id: number;
  name: string;
};

export type BusinessAreaResponse = BusinessArea[];

// Group Sessions
export type GroupSession = {
  id: number;
  name: string;
  location: string;
  description?: string;
  capacity?: number;
  date: string;
  host?: string;
  skills?: string[];
  users?: string[];

  // TODO: backend???
  link?: string;
};

export type GroupSessionResponse = GroupSession[];