import React from "react";

function Home({ income, expense }) {

  let totalExpense = expense.map(a => a.amount).reduce((a, current)=>{
    return a + current;
  }, 0);
  
  return (
    <div class="homePage">
      <h1>Welcome to your monthly expense tracker</h1>
      <h3>Your income is ${income}</h3>
      <h3>You spent a total of ${totalExpense}</h3>
      <h3>You have ${income-totalExpense} left to spend</h3>
    </div>
  )
}

export default Home;
