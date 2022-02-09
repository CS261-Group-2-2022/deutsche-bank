import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import { BareFetcher, SWRConfig } from "swr";
import UserProvider from "./utils/authentication";
import Mentoring from "./pages/Mentoring";

const fetcher: BareFetcher = (resource, init) =>
  fetch(resource, init).then((res) => res.json());

function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="mentoring" element={<Mentoring />} />
            {/* <Route path="groups" element={<GroupSessions />} /> */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SWRConfig>
  );
}

export default App;
