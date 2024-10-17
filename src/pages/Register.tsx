import { FC, FormEvent, useState } from "react";
import './login.css'
import { useDispatch } from "react-redux";
import { storeUser } from "../store/UserSlice";
import { axiosInstance } from "../utility/axiosInstance";
import { LoggedInUser } from "../models/user.models";
import { router } from "../router";
import { ErrorParser } from "../utility/errorParser";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../components/common/ErrorMessage";

export interface Coordinate{
    lat:number;
    long:number;
}
export const Register:FC = ()=>{


    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [errorLine,setErrorLine] = useState("")
    const dispatch = useDispatch()

    const submitForm = (event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        if(firstName.length === 0){
            setErrorLine("firstName is required")
            return;
        }
        if(email.length === 0){
            setErrorLine("Email is required")
            return;
        }
        if(lastName.length === 0){
            setErrorLine("lastName is required")
            return;
        }
        if(userName.length === 0){
            setErrorLine("userName is required")
            return;
        }
        if(email.length === 0){
            setErrorLine("email is required")
            return;
        }
        if(password.length === 0){
            setErrorLine("password is required")
            return;
        }
       
        //make API call
        axiosInstance.post('/auth/register',{
            firstname: firstName,
            lastname: lastName,
            username:userName,
            email,
            password,
        }).then(async(response)=>{
            console.log("response of register call is",response)
            const registedUser:LoggedInUser = response.data
            console.log("adding my socket to user after loggin in")
            dispatch(storeUser(registedUser))
            const userJSON = JSON.stringify(registedUser);
            localStorage.setItem('user', userJSON);
            dispatch(storeUser(registedUser))
            router.navigate('/');
        }, (error)=>{
            console.log("login failed")
            console.log(error)
            const stringError = ErrorParser(error);
            setErrorLine(stringError)
        })
        
    }

    return(

        <div className="my-3 row justify-content-center align-items-center">

            <form className="col-md-4 border rounded" onSubmit={submitForm}>
            <div className="form-group">
                <label htmlFor="name">FirstName</label>
                <input type="text" 
                className="form-control"
                 id="name" 
                 aria-describedby="emailHelp"
                 value={firstName}
                 onChange={e=>setFirstName(e.target.value)}
                 placeholder="Your Firstname"
                  />
            </div>
            <div className="form-group">
                <label htmlFor="name">lastName</label>
                <input type="text" 
                className="form-control"
                 id="name" 
                 aria-describedby="emailHelp"
                 value={lastName}
                 onChange={e=>setLastName(e.target.value)}
                 placeholder="Your LastName"
                  />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" 
                className="form-control"
                 id="email" 
                 aria-describedby="emailHelp"
                 value={email}
                 onChange={e=>setEmail(e.target.value)}
                 placeholder="Email"
                  />
            </div>
            <div className="form-group">
                <label htmlFor="name">Username</label>
                <input type="text" 
                className="form-control"
                 id="name" 
                 aria-describedby="emailHelp"
                 value={userName}
                 onChange={e=>setUserName(e.target.value)}
                 placeholder="Username"
                  />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input 
                className="form-control" 
                id="exampleInputPassword1" 
                value={password}
                type="password"
                onChange={e=>setPassword(e.target.value)}
                placeholder="Password"/>
            </div>

            <button type="submit" className="btn btn-primary my-2">Submit</button>

            <p>Already have an account? <Link to="/login">Login here.</Link> </p>
            <ErrorMessage
            errorLine={errorLine}/>
            
        </form>
        </div>
    )
}