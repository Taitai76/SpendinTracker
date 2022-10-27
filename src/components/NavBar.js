import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
  <nav>
    <NavLink
    exact
    to="/"
    >
      Home
    </NavLink>
    <NavLink
    to="/income"
    >
      Income
    </NavLink>
    <NavLink
    to="/expense"
    >
      Expense
    </NavLink>
  </nav>
      
  )
}

export default NavBar;