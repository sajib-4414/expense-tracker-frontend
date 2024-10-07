import './App.css';
import { RouterProvider } from "react-router-dom";
import { Provider } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'jquery';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.css';
import { store, useAppDispatch } from "./store/store";
import { useEffect } from 'react';
import { resetUser, storeUser } from './store/UserSlice';
import { router } from './router';
import { LoggedInUser } from './models/user.models';


const AppWrapper = ()=>{
   {/* we are wrapping so that App component itself can use React redux store(dispatch command), fetch functionalities */}
  return(
    
   
  <Provider store={store}>
        <App />
  </Provider>
  


   
  )
}

function App() {
  const dispatch = useAppDispatch(); // Works!
  useEffect(()=>{
    const storedUserData = localStorage.getItem("user");
    if(storedUserData){
      const loggedInUser: LoggedInUser = JSON.parse(
        storedUserData,
      ) as LoggedInUser;
      dispatch(storeUser(loggedInUser))
    }
    else{
      dispatch(resetUser())
    }
  })
  return (
    
        <RouterProvider router={router} />
        
  );
}

export default AppWrapper;