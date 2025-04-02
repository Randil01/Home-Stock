import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../navbar/navbar.css'; // Import the CSS file for custom styling

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home Stock</Link>
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
            {token ? (
              <>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/invlist">Groceries</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="">Assets</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/">Reminders</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/budgetDisplay">Budgeting</Link>
                </li>
                <li className="nav-item mx-3">
                  <button 
                    className="btn btn-danger rounded-pill px-3 shadow-sm mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item mx-3">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
