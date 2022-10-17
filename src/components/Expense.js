import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";

function Expense({ expense }){
    const [name, setName]= useState(" ")
    const [amount, setAmount]= useState(0)
    console.log(amount)

    return(
        <div>
            Expense Page
            <form>
                <p>Add Expense</p>
                <label>
                    Expense Name:
                    <input 
                    type='text' 
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    />
                </label>
                <label>
                    Expense amount:
                    <input 
                    type='text' 
                    name="name" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                    />
                </label>
                <button type="submit">Add</button>
            </form>
            {
                expense.map((item)=>(
                    <ExpenseList 
                    key={item.id} 
                    name={item.name}
                    amount={item.amount}
                    />
                ))
            }
        </div>
    )
}

export default Expense;