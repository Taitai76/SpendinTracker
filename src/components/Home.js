import React from "react";

function Home({ income, expense }) {
 const safeExpenses = Array.isArray(expense) ? expense : [];
 const safeIncome = Number.isFinite(income) ? income : 0;
 const totalExpense = safeExpenses
    .map(a => Number(a.amount) || 0)
    .reduce((a, current) => a + current, 0);
  
  return (
    <div className="homePage">
      <h1>Welcome to your monthly expense tracker</h1>
      <h2>You can rest the income on the income page and the expense under the expense page</h2>
      <h3>Your income is ${safeIncome}</h3>
      <h3>You spent a total of ${totalExpense}</h3>
      <h3>You have ${safeIncome - totalExpense} left to spend</h3>
    </div>
  )
}

export default Home;
