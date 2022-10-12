import React from "react";
import NavBar from "./NavBar";
import Expense from "./Expense";
import Income from "./Income";
import { Route, Switch } from "react-router";

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
      <Route path="/income">
        <Income />
      </Route>
      <Route path="/expense">
        <Expense />
      </Route>
      </Switch>
      Test
    </div>
  );
}

export default App;
