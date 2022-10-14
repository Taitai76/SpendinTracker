import React, { useEffect, useState } from "react";

function Expense(){

    const [expense, setExpense]= useState([])

  useEffect(()=>{
    fetch("http://localhost:4000/expenses")
    .then((r) => r.json())
      .then((items) => setExpense(items));
  }, []);
  
    return(
        <div>
            Expense Page
        </div>
    )
}

export default Expense;