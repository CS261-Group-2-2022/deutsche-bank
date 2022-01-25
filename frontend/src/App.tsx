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

  /// This is an object of the form: mentor = { id: 5 }.
  mentor? : Partial<User> | null = null

  async getMentor() : Promise<User | null> {
    // If the mentor is undefined, we don't have a mentor. Return undefined.
    if (this.mentor === null) {
      return null;
    }

    // If we already have the mentor fetched, then just return it.
    if (this.mentor?.first_name !== undefined) {
      return new User(this.mentor);
    }

    // Otherwise, we have to fetch it ourselves from the backend.
    let r = await fetch(`http://localhost:8000/api/v1/users/${this.mentor?.id}`);

    if (r.status !== 200) {
      debugger;
    }

    let j : Partial<User> = await r.json();
    let u : User = new User(j);

    // Save the mentor user for later.
    this.mentor = u;

    // And return it.
    return u;
  }

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

getAllUsers().then(us => us.forEach(u => {
  u.getMentor().then(m => {
    console.log(u);
    console.log('is mentored by');
    console.log(m);
  });
}))

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
