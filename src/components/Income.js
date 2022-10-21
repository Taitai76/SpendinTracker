import React, { useEffect, useState } from "react";

function Income({ income, updateIncome }){

    const [amount, setAmount]= useState(0);

    function handleSubmit(e){
        e.preventDefault();
    
        fetch(`http://localhost:4000/income`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount
      }),
    })
      .then((r) => r.json())
      .then((updatedItem) => updateIncome(updatedItem.amount));
    }

    return (
        <div>
            Income
            <form onSubmit={handleSubmit}>
                <p>Current monthly income is ${income}</p>
                <label>
                    Update Income:
                    <input 
                    type='text' 
                    name="name" 
                    value={amount} 
                    onChange={(e)=>setAmount(e.target.value)} />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default Income;