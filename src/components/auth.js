import { auth,googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css"
import SignUp from "../Pages/SignUp";



export const Auth = ()=>{
//set states of all inputs 
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    //use navigator 
    const navigate =useNavigate();


    console.log(auth?.currentUser?.email);

    //function for firebase signin.
    const SignUp = async ()=>{
try{await createUserWithEmailAndPassword(auth, email,password )}
catch(err){
    console.error(err)
}
    };      
    const signInWithGoogle = async ()=>{
        try{await signInWithPopup(auth,googleProvider)}
        catch(err){
            console.error(err)
        }
            }; 
            
          
            

            const logout = async ()=>{
                try{await signOut(auth);  navigate('/')}
                catch(err){
                    console.error(err)
                }
                    }; 
    return(
<div className="container">
  <p className="register-title">REGISTER</p>
  <input
    className="input"
    placeholder="Email....."
    onChange={(e) => setEmail(e.target.value)}
  />
  <input
    className="input"
    placeholder="Password"
    type="password"
    onChange={(e) => setPassword(e.target.value)}
  />
  <button className="button" onClick={SignUp}>
    Sign Up
  </button>
  <button className="button" onClick={signInWithGoogle}>
    Sign in with Google
  </button>
  <button className="button" onClick={logout}>
    Logout
  </button>
</div>

    );
}
