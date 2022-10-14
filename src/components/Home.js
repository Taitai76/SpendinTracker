import React, { useEffect, useState } from "react";

function Home({ income }) {
  
  const [expense, setExpense]= useState([])

  useEffect(()=>{
    fetch("http://localhost:4000/expenses")
    .then((r) => r.json())
      .then((items) => setExpense(items));
  }, []);

  let totalExpense = expense.map(a => a.amount).reduce((a, current)=>{
    return a + current;
  }, 0);
  
  return (
    <div>
      <h1>Home Page</h1>
      <h3>You have ${income-totalExpense} left to spend</h3>
    </div>
  )
}

export default Home;
