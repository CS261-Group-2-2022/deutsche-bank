import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import { BareFetcher, SWRConfig } from "swr";
import UserProvider from "./utils/authentication";
import Mentoring from "./pages/Mentoring";
import Login from "./pages/Login";
//import ProtectedPage from "./pages/ProtectedPage";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import { getAuthToken } from "./utils/endpoints";
import BusinessAreaProvider from "./utils/business_area";
import Logout from "./pages/Logout";
import ProtectedPage from "./pages/ProtectedPage";

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
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedPage>
                    <Home />
                  </ProtectedPage>
                }
              />
              <Route
                path="mentoring"
                element={
                  <ProtectedPage>
                    <Mentoring />
                  </ProtectedPage>
                }
              />
              {/* <Route path="groups" element={<GroupSessions />} /> */}
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="settings"
                element={
                  <ProtectedPage>
                    <Settings />
                  </ProtectedPage>
                }
              />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </BusinessAreaProvider>
    </SWRConfig>
  );
}

export default App;
