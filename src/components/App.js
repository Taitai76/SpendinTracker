import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Expense from "./Expense";
import Income from "./Income";
import Home from "./Home";
import { Route, Switch } from "react-router";

function App() {
  const [income, setIncome]= useState(0)
  const [expense, setExpense]= useState([])

  useEffect(()=>{
    fetch(("http://localhost:4000/income"))
    .then((r) => r.json())
      .then((items) => setIncome(items.amount));
      console.log(income)
      
    fetch("http://localhost:4000/expenses")
    .then((r) => r.json())
      .then((items) => setExpense(items));
  }, []);

  function handleExpenseUpdate(x){
    setExpense(x)
  }

  function addExpenses(newItem){
    setExpense([...expense, newItem])
  }

  function updateIncome(newItem){
    setIncome(newItem)
  }

  return (
    <div className="App">
      <NavBar />
      <Switch>
      <Route path="/income">
        <Income income={income} updateIncome={updateIncome}/>
      </Route>
      <Route path="/expense">
        <Expense 
        expense={expense} 
        updateExpnsesState={handleExpenseUpdate}
        addToExpenses={addExpenses}/>
      </Route>
      <Route path="/">
        <Home income={income} expense={expense}/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
