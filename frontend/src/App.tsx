import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import { BareFetcher, SWRConfig } from "swr";
import UserProvider from "./utils/authentication";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import { getAuthToken } from "./utils/endpoints";
import BusinessAreaProvider from "./utils/business_area";
import Logout from "./pages/Logout";
import ProtectedPage from "./pages/ProtectedPage";
import GroupSessions from "./pages/GroupSessions";
import SkillsProvider from "./utils/skills";
import Feedback from "./pages/Feedback";
import LoggedOutPage from "./pages/LoggedOutPage";
import MentoringProfile from "./pages/MentoringProfile";
import YourMentees from "./pages/YourMentees";
import MentoringMatchingPage from "./components/mentoring/MentoringMatching";

const fetcher: BareFetcher = async (resource) => {
  const token = getAuthToken();

  const res = await fetch(resource, {
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Token ${token}` : "",
    },
  });

  const response = await res.json();

  if (res.ok) {
    return response;
  } else {
    throw new Error(response);
  }
};

function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <BusinessAreaProvider>
        <SkillsProvider>
          <UserProvider>
            <BrowserRouter>
              <Routes>
                {/* All subpages here are rendered as protected pages */}
                <Route element={<ProtectedPage />}>
                  <Route path="/" element={<Home />} />
                  <Route path="mentoring" element={<Outlet />}>
                    {/* Have an index route so that the main /mentoring just redirects to your profile */}
                    <Route index element={<Navigate to="/mentoring/me" />} />
                    <Route path=":user" element={<MentoringProfile />} />
                    <Route path="mentees" element={<YourMentees />} />
                    <Route
                      path="matching"
                      element={<MentoringMatchingPage />}
                    />
                  </Route>
                  <Route path="groups" element={<GroupSessions />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* All subpages here are rendered as logged out pages - i.e. if you are logged in you will be redirected out of here */}
                <Route element={<LoggedOutPage />}>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                </Route>

                <Route path="logout" element={<Logout />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </SkillsProvider>
      </BusinessAreaProvider>
    </SWRConfig>
  );
}

export default App;
