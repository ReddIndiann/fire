import { auth,googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";





export const Auth = ()=>{

    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const navigate =useNavigate();
    console.log(auth?.currentUser?.email);
    const signIn = async ()=>{
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
<div>
    <p>Register</p>
    <input placeholder="Email....." 
    onChange={(e)=> setEmail(e.target.value)}/>
    <input placeholder="Password"
    type="password"
       onChange={(e)=> setPassword(e.target.value)}
    />
    <button onClick={signIn}>Sign In</button>
    <button onClick={signInWithGoogle}>Sign in with Google</button>
    <button onClick={logout}>logout</button>
</div>
    );
}