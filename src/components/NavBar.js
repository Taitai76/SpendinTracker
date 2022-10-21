import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
  <div class="navbar">
    <NavLink
    to="/"
    class="navlink"
    exact>
      Home
    </NavLink>

    <NavLink
    to="/income"
    class="navlink"
    exact>
      Income
    </NavLink>

    <NavLink
    to="/expense"
    class="navlink"
    exact>
      Expense
    </NavLink>
  </div>
  )
}

export default NavBar;