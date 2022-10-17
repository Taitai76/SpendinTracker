import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";

function Expense({ expense }){
    const [name, setName]= useState(" ")
    const [amount, setAmount]= useState(0)
    const [expenses, setItems] = useState(expense);

    function handleDeleteItem(deletedItem) {
        const updatedItems = expense.filter((item) => item.id !== deletedItem.id);
        setItems(updatedItems);
      }
    
    function handleSubmit(e) {
        e.preventDefault();
        const itemData = {
          name: name,
          amount: parseInt(amount),
        };
        fetch("http://localhost:4000/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        })
          .then((r) => r.json())
          .then((newItem) => setItems([...expenses, newItem]));
      }

    return(
        <div>
            Expense Page
            <form onSubmit={handleSubmit}>
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
                expenses.map((item)=>(
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