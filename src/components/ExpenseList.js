import React from "react";
import ExpenseShow from "./ExpenseShow";

function ExpenseList({name, amount}){
    return(
        <div>
            <li>
                {name}
                <ExpenseShow />
            </li>
        </div>
    )
}

export default ExpenseList;