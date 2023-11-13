import { auth,googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword,signInWithPopup,signOut} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const Login= ()=>{
const navigate =useNavigate();
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

   
    const signIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // Redirect to the home screen after a successful login
          navigate("/movie"); // Replace "/home" with the actual route for your home screen.
        } catch (err) {
          console.error(err);
        }
      };
          
    const signInWithGoogle = async ()=>{
        try{await signInWithPopup(auth,googleProvider)}
        catch(err){
            console.error(err)
        }
            }; 
            
          
            

            const logout = async ()=>{
                try{await signOut(auth)}
                catch(err){
                    console.error(err)
                }
                    }; 
    return(
<div>

<p>Log in r</p>
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