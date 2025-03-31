// components/Navbar.js
import React from "react";
import "../App.css";

const Navbar = ({ userName, setCurrentSection }) => {
  return (
    <nav className="navbar sticky-navbar">
      <span className="nav-user">👋 {userName}</span>
      <div className="navbar-center-title">Metal Classification</div>
      <div className="navbar-links">
        <button onClick={() => setCurrentSection("classification")}>Classification</button>
        <button onClick={() => setCurrentSection("history")}>History</button>
      </div>
    </nav>
  );
};

export default Navbar;
