import React, { useEffect, useState } from "react";
import { API_BASE } from '../api';

function Income({ income, updateIncome }){
    const [amount, setAmount]= useState(0);

    function handleSubmit(e){
        e.preventDefault();
    
        fetch(
          `${API_BASE}/income`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: amount,
            }),
          }
        )
          .then((r) => r.json())
          .then((updatedItem) => updateIncome(updatedItem.amount));
    }

    return (
        <div className="income">
            <h3>Income</h3>
            <form onSubmit={handleSubmit}>
                <p>Current monthly income is ${income}</p>
                <label className="question">
                    Update Income:
                    <input 
                    type='text' 
                    name="name" 
                    value={amount} 
                    onChange={(e)=>setAmount(e.target.value)} />
                </label>
                <button className="updateBtn" type="submit">Update</button>
            </form>
        </div>
    )
}

export default Income;