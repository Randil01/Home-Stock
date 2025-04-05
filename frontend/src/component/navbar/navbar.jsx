import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../navbar/navbar.css'; // Import the CSS file for custom styling

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Home Stock</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Grocery Inventory</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Assets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Reminders</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Budgeting</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
