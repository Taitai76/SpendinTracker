import React from "react";
import { Link } from "react-router-dom";


function ExpenseList({item, onDeleteItem}){
    
    function handleDeleteClick() {
        fetch(`http://localhost:4000/expenses/${item.id}`, {
          method: "DELETE",
        })
          .then((r) => r.json())
          .then(() => onDeleteItem(item));
      }

    return(
        <div class="expensesList">
            <li>
                {item.name} 
            </li>
            <Link to={`/expense/${item.id}`} > More</Link>
            <button class="deleteBtn" onClick={handleDeleteClick}>
               Delete
            </button>
        </div>
    )
}

export default ExpenseList;