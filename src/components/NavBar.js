import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
  <div className= "navbar">
    <NavLink
    to="/"
    exact>
      Home
    </NavLink>

    <NavLink
    to="/income"
    exact>
      Income
    </NavLink>

    <NavLink
    to="/expense"
    exact>
      Expense
    </NavLink>
  </div>
  )
}

export default NavBar;