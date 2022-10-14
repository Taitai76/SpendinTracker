import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";

function Expense({ expense }){

    return(
        <div>
            Expense Page
            <form>
                <p>Add Expense</p>
                <label>
                    Expense Name:
                    <input type='text' name="name" />
                </label>
                <label>
                    Expense amount:
                    <input type='text' name="name" />
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