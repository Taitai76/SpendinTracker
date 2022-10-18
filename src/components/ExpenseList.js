import React from "react";
import ExpenseShow from "./ExpenseShow";
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
        <div>
            <li>
                {item.name}
                <ExpenseShow amount={item.amount}/>
            </li>
            <button onClick={handleDeleteClick}>
               Delete
            </button>
        </div>
    )
}

export default ExpenseList;