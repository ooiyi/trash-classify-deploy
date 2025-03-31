// components/Navbar.js
import React from "react";

const Navbar = ({ userName, setCurrentSection, menuOpen, setMenuOpen }) => (
  <nav className="navbar sticky-navbar">
    <span className="nav-user">👋 {userName}</span>
    <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
      &#9776;
    </div>
    {menuOpen && (
      <div className="dropdown-menu">
        <button onClick={() => { setCurrentSection("classification"); setMenuOpen(false); }}>Classification</button>
        <button onClick={() => { setCurrentSection("history"); setMenuOpen(false); }}>History</button>
      </div>
    )}
  </nav>
);

export default Navbar;