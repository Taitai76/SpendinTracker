import React from "react";
import { Link } from "react-router-dom";
import { API_BASE } from '../api';


function ExpenseList({item, onDeleteItem}){
    
    function handleDeleteClick() {
        fetch(
          `${API_BASE}/expenses/${item.id}`,
          {
            method: "DELETE",
          }
        )
          .then((r) => r.json())
          .then(() => onDeleteItem(item));
      }

    return(
        <div className="expensesList">
            <li>
                {item.name} 
            </li>
            <Link to={`/expense/${item.id}`} > More</Link>
            <button className="deleteBtn" onClick={handleDeleteClick}>
               Delete
            </button>
        </div>
    )
}

export default ExpenseList;