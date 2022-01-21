import * as React from 'react';
import * as ReactDOM from 'react-dom';

fetch("http://127.0.0.1:8000/").then(r => r.text()).then(t => console.log(t));

var layout =
  <div>
    <h1>CS261 Software Engineering Group 2</h1>
    <p>I literally super hate javascript</p>
    <p>This boy slow</p>
  </div>;

ReactDOM.render(
  layout,
  document.getElementById("root")
);
