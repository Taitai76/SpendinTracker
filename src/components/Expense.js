import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";


function Expense({expense, updateExpnsesState, addToExpenses}){
    const [name, setName]= useState(" ")
    const [amount, setAmount]= useState(0)
    const [date, setDate]= useState("0000-00-00")
    

    function handleDeleteItem(deletedItem) {
        const updatedItems = expense.filter((item) => item.id !== deletedItem.id);
        updateExpnsesState(updatedItems);
      }
    
    function handleSubmit(e) {
        e.preventDefault();
        const itemData = {
          name: name,
          amount: parseInt(amount),
          date: date
        };
        fetch("http://localhost:4000/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        })
          .then((r) => r.json())
          .then((newItem) => addToExpenses(newItem));
      }


    return(
        <div class="expensesPage">
            <h3>Expense Page</h3>
            <form onSubmit={handleSubmit}>
                <p>Add Expense</p>
                <label class="question">
                    Expense Name:
                    <input 
                    type='text' 
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    />
                </label>

                <label class="question">
                    Expense amount:
                    <input 
                    type='text' 
                    name="name" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} 
                    />
                </label>
                <label class='question'>
                  Date:
                  <input 
                  type="date"
                  value={date}
                  onChange={(e)=> setDate(e.target.value)}
                  />
                </label>
                <button class="btn" type="submit">Add</button>
            </form>
            <h3>Your Expenses</h3>
            {
                expense.map((item)=>(
                    <ExpenseList 
                    key={item.id} 
                    item={item}
                    onDeleteItem={handleDeleteItem}
                    />
                ))
            }
        </div>
    )
}

export default Expense;