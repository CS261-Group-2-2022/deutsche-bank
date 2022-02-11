import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import { BareFetcher, SWRConfig } from "swr";
import UserProvider from "./utils/authentication";
import Mentoring from "./pages/Mentoring";
import Login from "./pages/Login";
//import ProtectedPage from "./pages/ProtectedPage";
import Signup from "./pages/Signup";

const fetcher: BareFetcher = (resource, init) =>
  fetch(resource, init).then((res) => res.json());

// class BusinessArea {
//   id: number = 0
//   name: string = ""

//   constructor(from: Partial<BusinessArea>) {
//     Object.assign(this, from);
//   }
// }

// class Expertise {
//   id: number = 0
//   name: string = ""

//   constructor(from: Partial<Expertise>) {
//     Object.assign(this, from);
//   }
// }

// class UserExpertise {
//   user?: User = undefined
//   expertise?: Expertise = undefined

//   constructor(from: Partial<UserExpertise>) {
//     Object.assign(this, from);
//   }
// }

// /// Typescript version of the model in backend/apis/models.py
// class User {
//   id : number = 0

//   first_name : string = ""
//   last_name : string = ""

//   business_area : BusinessArea | null = null

//   email : string = ""
//   is_email_verified : boolean = false

//   password : string = "" // TODO(arwck): This shouldn't be serialized.

//   /// This is an object of the form: mentor = { id: 5 }.
//   mentor? : Partial<User> | null = null

//   async getExpertise() : Promise<UserExpertise[]> {
//     let r = await fetch(`http://localhost:8000/api/v1/users/${this.id}/get_expertise`);

//     if (r.status !== 200) {
//       debugger;
//     }

//     let j : Partial<UserExpertise>[] = await r.json();
//     let ues : UserExpertise[] = j.map(ue => new UserExpertise(ue));

//     return ues;
//   }

//   async getMentor() : Promise<User | null> {
//     // If the mentor is undefined, we don't have a mentor. Return undefined.
//     if (this.mentor === null) {
//       return null;
//     }

//     // If we already have the mentor fetched, then just return it.
//     if (this.mentor?.first_name !== undefined) {
//       return new User(this.mentor);
//     }

//     // Otherwise, we have to fetch it ourselves from the backend.
//     let r = await fetch(`http://localhost:8000/api/v1/users/${this.mentor?.id}`);

//     if (r.status !== 200) {
//       debugger;
//     }

//     let j : Partial<User> = await r.json();
//     let u : User = new User(j);

//     // Save the mentor user for later.
//     this.mentor = u;

//     // And return it.
//     return u;
//   }

//   constructor(from: Partial<User>) {
//     Object.assign(this, from);
//   }
// }

// /// Retrieves the list of all users using the REST API, returning them as User instances.
// let getAllUsers : () => Promise<User[]> =
//   async () => {
//     let r = await fetch('http://localhost:8000/api/v1/users/');

//     if (r.status !== 200) {
//       debugger;
//     }

//     let j : Partial<User>[] = await r.json();

//     return j.map(u => new User(u));
//   }

// getAllUsers()

//   // Let's print out all the mentorship relationships
//   .then(us => {
//     us.forEach(u => {
//         u.getMentor().then(m => {
//           console.log(u.first_name + ' is mentored by ' + m?.first_name);
//       });
//     });

//     return us;
//   })

//   // Let's print out all the expertises
//   .then(us => {
//     us.forEach(u => {
//       u.getExpertise().then(
//         ues => ues.forEach(ue => {
//           console.log(u.first_name + ' has expertise "' + ue.expertise?.name + '"');
//         })
//       )
//     })
//   });

function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="mentoring" element={<Mentoring />} />
            {/* <Route path="groups" element={<GroupSessions />} /> */}
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SWRConfig>
  );
}

export default App;
