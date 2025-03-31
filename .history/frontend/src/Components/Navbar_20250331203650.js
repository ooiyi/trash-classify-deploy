import React from "react";
import "../App.css";

const Navbar = ({ userName, setCurrentSection }) => (
  <nav className="navbar sticky-navbar">
    <span className="nav-user">👋 {userName}</span>
    <div className="navbar-buttons">
      <button onClick={() => setCurrentSection("classification")}>Classification</button>
      <button onClick={() => setCurrentSection("history")}>History</button>
    </div>
  </nav>
);

export default Navbar;