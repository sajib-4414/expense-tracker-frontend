import { Link, useLocation } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { LoggedInUser } from "../models/user.models";
import { useAppDispatch, useAppSelector } from "../store/store";
import { resetUser } from "../store/UserSlice";
import { router } from "../router";

export const Sidebar = () => {

  const location = useLocation(); // Get current location
  const loggedinUser:LoggedInUser|null = useAppSelector(
    (state)=> state.userSlice.loggedInUser //we can also listen to entire slice instead of loggedInUser of the userSlice
  )
  const dispatch = useAppDispatch();
  const handleLogout = async()=>{
        dispatch(resetUser())
        router.navigate('/login')
    }
    


  // Helper function to determine if the link is active
  const isActive = (path:string) => location.pathname === path ? "active" : "text-white";

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
          <Link to="/categories" className={`nav-link ${isActive('/categories')}`}>
            <i className="bi bi-list-ul me-2"></i>
            Income Sources & Categories
          </Link>
        </li>
      </ul>
      <hr />
  

      <div style={{display:"flex"}}>
     
      <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          
       
          <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            {loggedinUser?.user.firstname+" " + loggedinUser?.user.lastname}
          </Dropdown.Toggle>
    
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
          
      
      
    </div>
  );
};
