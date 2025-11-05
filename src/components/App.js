import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Expense from "./Expense";
import Income from "./Income";
import Home from "./Home";
import ExpenseDetail from "./ExpenseDetail"
import { Route, Switch } from "react-router-dom";
import { API_BASE } from '../api';

function App() {
  const [income, setIncome]= useState(0)
  const [expense, setExpense]= useState([])

  useEffect(()=>{
    fetch((`${API_BASE}/income`))
    .then((r) => r.json())
      .then((items) => setIncome(items.amount));
      
    fetch(
      `${API_BASE}/expenses`
    )
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
      <Route  exact path="/expense">
        <Expense 
        expense={expense} 
        updateExpnsesState={handleExpenseUpdate}
        addToExpenses={addExpenses}/>
      </Route>
      <Route path="/expense/:id">
        <ExpenseDetail />
      </Route>
      <Route exact path="/">
        <Home income={income} expense={expense}/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
