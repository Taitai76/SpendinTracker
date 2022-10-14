import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Expense from "./Expense";
import Income from "./Income";
import Home from "./Home";
import { Route, Switch } from "react-router";

function App() {
  const [income, setIncome]= useState(0)

  useEffect(()=>{
    fetch(("http://localhost:4000/income"))
    .then((r) => r.json())
      .then((items) => setIncome(items.amount));
  }, []);

  return (
    <div>
      <NavBar />
      <Switch>
      <Route path="/income">
        <Income income={income}/>
      </Route>
      <Route path="/expense">
        <Expense />
      </Route>
      <Route path="/">
        <Home income={income}/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
