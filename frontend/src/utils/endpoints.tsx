import { mutate } from "swr";

const HOSTNAME =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";

export const LOGIN_ENDPOINT = `${HOSTNAME}/api/v1/auth/login/`;
export const SIGNUP_ENDPOINT = `${HOSTNAME}/api/v1/auth/register/`;
export const PROFILE_ENDPOINT = `${HOSTNAME}/api/v1/auth/profile/`;
export const BUSINESS_AREAS_ENDPOINT = `${HOSTNAME}/api/v1/area/`;
export const LIST_All_GROUP_SESSIONS_ENDPOINT = `${HOSTNAME}/api/v1/session/`;
export const LIST_USER_SUGGESTED_SESSIONS_ENDPOINT = `${HOSTNAME}/api/v1/session/find/`;
export const LIST_USER_JOINED_SESSIONS_ENDPOINT = `${HOSTNAME}/api/v1/session/user`;
export const LIST_USER_HOSTING_SESSIONS_ENDPOINT = `${HOSTNAME}/api/v1/session/host`;
export const CREATE_GROUP_SESSION_ENDPOINT = `${HOSTNAME}/api/v1/session/`;
export const JOIN_SESSION_ENDPOINT = `${HOSTNAME}/api/v1/session/{ID}/join/`;
export const LEAVE_SESSION_ENDPOINT = `${HOSTNAME}/api/v1/session/{ID}/leave/`;
export const SKILLS_ENDPOINT = `${HOSTNAME}/api/v1/skills/`;
export const SETTINGS_ENDPOINT = `${HOSTNAME}/api/v1/user/{ID}/`;
export const FEEDBACK_ENDPOINT = `${HOSTNAME}/api/v1/feedback/`;
export const FULL_USER_ENDPOINT = `${HOSTNAME}/api/v1/user/{ID}/full/`;
export const MENTORSHIP_ENDPOINT = `${HOSTNAME}/api/v1/mentorship/{ID}/`;
export const END_MENTORSHIP_ENDPOINT = `${HOSTNAME}/api/v1/mentorship/{ID}/end/`;
export const CURRENT_MENTEES_ENDPOINT = `${HOSTNAME}/api/v1/user/mentees/`;
export const SUGGESTED_MENTORS_ENDPOINT = `${HOSTNAME}/api/v1/user/matching/`;
export const OUTGOING_REQUESTS_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/outgoing/`;
export const INCOMING_REQUESTS_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/incoming/`;
export const CREATE_MENTORING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/`;
export const ACCEPT_MENTORING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/{ID}/accept/`;
export const DECLINE_MENTORING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/{ID}/decline/`;
export const CANCEL_MENTORING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-request/{ID}/cancel/`;
export const UPDATE_MEETING_ENDPOINT = `${HOSTNAME}/api/v1/meeting/{ID}/`;
export const CREATE_MEETING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/meeting-request/`;
export const ACCEPT_MEETING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/meeting-request/{ID}/accept/`;
export const DECLINE_MEETING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/meeting-request/{ID}/decline/`;
export const CANCEL_MEETING_REQUEST_ENDPOINT = `${HOSTNAME}/api/v1/meeting-request/{ID}/cancel/`;
export const LIST_USER_PLANS = `${HOSTNAME}/api/v1/user/{ID}/plans/`;
export const CREATE_USER_PLANS = `${HOSTNAME}/api/v1/plan/`;
export const CHANGE_USER_PLANS = `${HOSTNAME}/api/v1/plan/{ID}/`;
export const UPCOMING_SESSIONS_ENDPOINT = `${HOSTNAME}/api/v1/events/`;
export const CREATE_MENTOR_FEEDBACK_ENDPOINT = `${HOSTNAME}/api/v1/mentorship-feedback/`;

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
  mentorship?: number;
  interests: number[];
  expertise: number[];
  interests_description?: string;
  image_link?: "";
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
  interests: Skill[];
  interests_description?: string;
  image_link?: "";
};

/** Drops down a UserFull data type to just a User, for simplicity */
export const userFullToUser = (user: UserFull): User => {
  return Object.assign(
    {},
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_email_verified: user.is_email_verified,
      mentor_intent: user.mentor_intent,
      business_area: user.business_area.id,
      mentorship: user.mentorship?.id,
      interests: user.interests.map((skill) => skill.id),
      expertise: user.expertise.map((skill) => skill.id),
      interests_description: user.interests_description,
    }
  );
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
  name?: string[];
};
export type CreateSkillResponse = CreateSkillSuccess | CreateSkillError;

// Mentorship
export type Mentorship = {
  id: number;
  meetings: Meeting[];
  meeting_requests: MeetingRequest[];
  mentor_feedback: MentorFeedback[];
  rating?: number;
  feedback?: string;
  mentee: number;
  mentor: number;
};

export type MentorshipRequest = {
  id: number;
  mentor: User;
  mentee: User;
};

export type MentorFeedback = {
  id: number;
  mentorship: number;
  time: string;
  positives: string;
  improvements: string;
};

// Meeting
export type Meeting = {
  id: number;
  time: string;
  mentorship: number;
  mentee_notes?: string;
  mentor_notes?: string;
  location: string;
  description: string;
};

export type MeetingRequest = {
  id: number;
  time: string;
  location: string;
  description: string;
  mentorship: number;
};

// Meeting version sent through GET /events/
export type ExtendedMeeting = {
  isMeeting: true;
  id: number;
  time: string;
  mentorship: {
    mentor: User;
    mentee: User;
  };
  mentee_notes?: string;
  mentor_notes?: string;
  location: string;
  description: string;
};

//Plan Of Action
export type PlanOfAction = {
  id: number;
  user: number;
  name: string;
  description: string;
  due_date: string;
  creation_date: string;
  completed: boolean;
  completion_date: string;
};

export type PlanOfActionResponse = PlanOfAction[];

// Upcoming Sessions
export type UpcomingSessions = {
  meetings: ExtendedMeeting[];
  sessions: GroupSession[];
};
