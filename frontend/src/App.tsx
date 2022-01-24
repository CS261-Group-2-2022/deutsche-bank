import React from "react";
import logo from "./logo.svg";
import "./App.css";

/// Typescript version of the model in backend/apis/models.py
class User {
  id : number = 0

  first_name : string = ""
  last_name : string = ""

  email : string = ""
  is_email_verified : boolean = false

  password : string = "" // TODO(arwck): This shouldn't be serialized.

  mentor? : User = undefined

  constructor(from: Partial<User>) {
    Object.assign(this, from);
  }
}

/// Retrieves the list of all users using the REST API, returning them as User instances.
let getAllUsers : () => Promise<User[]> =
  async () => {
    let r = await fetch('http://localhost:8000/api/v1/users/');

    if (r.status !== 200) {
      debugger;
    }

    let j : Partial<User>[] = await r.json();

    return j.map(u => new User(u));
  }

getAllUsers().then(console.log);

let App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hello! Check the console to see the list of users.
        </a>
      </header>
    </div>
  );
}

export default App;
