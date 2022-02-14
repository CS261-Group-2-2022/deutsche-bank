export const LOGIN_ENDPOINT = "http://localhost:8000/api/v1/auth/login/";
export const SIGNUP_ENDPOINT = "http://localhost:8000/api/v1/auth/register/";

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
  window.sessionStorage.removeItem("token");
  window.localStorage.removeItem("token");

  if (remember) {
    window.localStorage.setItem("token", token);
  } else {
    window.sessionStorage.setItem("token", token);
  }
};

export type LoginSuccess = {
  user: unknown;
  token: string;
};

export type LoginError = {
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
};

export type LoginBody = LoginSuccess | LoginError;

// export type UserData = {
//   email: string;
//   first_name: string;
//   last_name: string;
//   business_area: string;
//   password: string;
// };

// export const signupUser = async (data: UserData) => {
//   return await fetch("/auth/register", {
//     method: "POST",
//     body: JSON.stringify(data),
//   }).then((res) => res.json());
// };
