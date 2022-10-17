import React from "react";
import ExpenseShow from "./ExpenseShow";
import { Link } from "react-router-dom";


function ExpenseList({name, amount}){
    return(
        <div>
            <li>
                {name}
                <ExpenseShow amount={amount}/>
            </li>
        </div>
    )
}

export default ExpenseList;