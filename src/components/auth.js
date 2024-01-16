import { auth,googleProvider,db } from "../config/firebase";
import { createUserWithEmailAndPassword,signInWithPopup,signOut} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection,setDoc,doc } from "firebase/firestore";
import "./auth.css"
import SignUp from "../Pages/SignUp";



export const Auth = ()=>{
//set states of all inputs 
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    //use navigator 
    const navigate =useNavigate();


    console.log(auth?.currentUser?.email);


    const usersCollectionRef = collection(db, 'users');

    const SignUp = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Add user details to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
         role:"user"
        });
  
        navigate('/'); // Redirect to home or wherever you want after signup
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
    Logoutt
  </button>
</div>

    );
}