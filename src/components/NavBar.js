import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
  <div>
    <ul class="navbar">

      <li>
    <NavLink
    to="/"
    exact
    class="nav-bar-link"
    style={({isActive})=>{return {color : isActive?'yellow':''}}}
    >
      Home
    </NavLink>
      </li>

      <li>
    <NavLink
    to="/income"
    class="nav-bar-link"
    style={({isActive})=>{return {color : isActive?'yellow':''}}}
    >
      Income
    </NavLink>
      </li>

      <li>
    <NavLink
    to="/expense"
    class="nav-bar-link"
    style={({isActive})=>{return {color : isActive?'yellow':''}}}
    >
      Expense
    </NavLink>
      </li>

    </ul>

  </div>
  )
}

export default NavBar;