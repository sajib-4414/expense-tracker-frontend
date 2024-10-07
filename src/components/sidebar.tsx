import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Get current location

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Helper function to determine if the link is active
  const isActive = (path) => location.pathname === path ? "active" : "text-white";

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark h-100">
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <i className="bi bi-currency-exchange p-2"></i>
        <span className="fs-4">Expense Tracker</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive('/')}`} aria-current="page">
            <i className="bi bi-house me-2"></i>
            Home
          </Link>
        </li>
        <li>
          <Link to="/income" className={`nav-link ${isActive('/income')}`}>
            <i className="bi bi-wallet-fill me-2"></i>
            Income
          </Link>
        </li>
        <li>
          <Link to="/expenses" className={`nav-link ${isActive('/expenses')}`}>
            <i className="bi bi-card-checklist me-2"></i>
            Expenses
          </Link>
        </li>
        <li>
          <Link to="/budgets" className={`nav-link ${isActive('/budgets')}`}>
            <i className="bi bi-bar-chart me-2"></i>
            Budget dashboard
          </Link>
        </li>
        <li>
          <Link to="/report" className={`nav-link ${isActive('/report')}`}>
            <i className="bi bi-file-earmark-check me-2"></i>
            Report
          </Link>
        </li>
        <li>
          <Link to="/categories" className={`nav-link ${isActive('/categories')}`}>
            <i className="bi bi-list-ul me-2"></i>
            Categories
          </Link>
        </li>
      </ul>
      <hr />
      
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>mdo</strong>
        </a>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">New project...</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Sign out</a></li>
          </ul>
        )}
      </div>
    </div>
  );
};
