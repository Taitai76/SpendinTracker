import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

function ExpenseDetail(){
    const [expense, setExpense]=useState(null)
    const {id}=useParams()

    useEffect(()=>{
        fetch(
          `${API_BASE}/expenses/` +
            id
        )
          .then((r) => r.json())
          .then((items) => setExpense(items));
    }, [id])
    
    if (!expense) return <h2>Finding Expense...</h2>

    return(
        <div className='expenseDetails'>
            <h2>{expense.name}</h2>  
            <p>You spent ${expense.amount} on {expense.date}</p>
        </div>
    )
}
export default ExpenseDetail;