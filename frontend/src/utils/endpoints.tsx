import { mutate } from "swr";

export const LOGIN_ENDPOINT = "http://localhost:8000/api/v1/auth/login/";
export const SIGNUP_ENDPOINT = "http://localhost:8000/api/v1/auth/register/";
export const PROFILE_ENDPOINT = "http://localhost:8000/api/v1/auth/profile/";
export const BUSINESS_AREAS_ENDPOINT = "http://localhost:8000/api/v1/area/";
export const LIST_GROUP_SESSIONS_ENDPOINT =
  "http://localhost:8000/api/v1/session/";
export const LIST_USER_JOINED_SESSIONS_ENDPOINT =
  "http://localhost:8000/api/v1/session/user";
export const LIST_USER_HOSTING_SESSIONS_ENDPOINT =
  "http://localhost:8000/api/v1/session/host";
export const CREATE_GROUP_SESSION_ENDPOINT =
  "http://localhost:8000/api/v1/session/";
export const JOIN_SESSION_ENDPOINT =
  "http://localhost:8000/api/v1/session/{ID}/join/";
export const LEAVE_SESSION_ENDPOINT =
  "http://localhost:8000/api/v1/session/{ID}/leave/";
export const SKILLS_ENDPOINT = "http://localhost:8000/api/v1/skills/";
export const SETTINGS_ENDPOINT = "http://localhost:8000/api/v1/user/{ID}/";
export const FEEDBACK_ENDPOINT = "http://localhost:8000/api/v1/feedback/";
export const FULL_USER_ENDPOINT =
  "http://localhost:8000/api/v1/user/{ID}/full/";

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

  // Update caches of user profiles
  mutate(PROFILE_ENDPOINT);
};

export const clearAuthToken = () => {
  window.sessionStorage.removeItem("token");
  window.localStorage.removeItem("token");

  // Force cache revalidation
  mutate(PROFILE_ENDPOINT);
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
  interests: number[];
  expertise: number[];

  // TODO: backend
  bio?: string;
};

export type Mentorship = {
  id: number;
  rating: null;
  feedback: null;
  mentee: number;
  mentor: number;
};

export type Interest = {
  id: number;
  name: string;
};

export type UserFull = {
  id: number;
  business_area: BusinessArea;
  expertise: Skill[];
  mentorship?: Mentorship;
  last_login: null;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  mentor_intent: boolean;
  interests: Interest;
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
  capacity: number;
  date: string;
  host: User;
  skills?: Skill[];
  users: User[];
  virtual_link?: string;
};

export type GroupSessionResponse = GroupSession[];

export type CreateSessionSuccess = number;
export type CreateSessionError = {
  name?: string[];
  location?: string[];
  description?: string[];
  capacity?: string[];
  date?: string[];
  non_field_errors?: string[];
  virtual_link?: string[];
  skills?: string[];
};

export type CreateSessionResponse = CreateSessionSuccess | CreateSessionError;

export type JoinSessionSuccess = number;
export type JoinSessionError = {
  error: string;
};

export type JoinSessionResponse = JoinSessionSuccess | JoinSessionError;

// Skills
export interface Skill {
  id: number;
  name: string;
}
export type SkillsResponse = Skill[];

export type CreateSkillSuccess = Skill;
export type CreateSkillError = {
  error: string;
};
export type CreateSkillResponse = CreateSkillSuccess | CreateSkillError;

// Meeting
export type Meeting = {
  id: number;
  time: string;
  mentorship: number;

  // TODO: backend?
  location: string;
  description: string;
  mentee_notes: string;
  mentor_notes: string;
};

export type MeetingRequest = {
  id: number;
  time: string;
  location: string;
  description: string;
  mentorship: number;
};

//Plan Of Action
export type PlanOfAction = {
  name: string;
  description: string;
  // user: User;
  creation_date: string;
  completion_date: string;
};

export type PlanOfActionResponse = PlanOfAction[];
