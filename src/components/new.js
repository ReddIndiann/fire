// ... (your imports)
import {  googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import {useEffect, useState } from 'react';
import { getDocs ,setDoc,collection, addDoc,deleteDoc,doc,updateDoc  } from 'firebase/firestore';
import {db, auth } from '../config/firebase';
import { Link } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
  
    // Add a state variable to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const handleInputFocus = () => {
      setError(null);
    };
  
    const signIn = async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        navigate("/movie");
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/movie"); 
    } catch (err) {
      console.error(err);
      setError(err.message); // Set the error message in state
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      setError(err.message); // Set the error message in state
    }
  };
  
    // ... (your existing functions)
  
    useEffect(() => {
      // This effect will run when isLoggedIn changes to true
      if (isLoggedIn) {
        // Example: Push user data to Firestore
        const pushUserDataToFirestore = async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              // Assuming you have a "users" collection in Firestore
              const userDocRef = doc(db, "userDetails", user.uid);
              
              // Replace this with your actual data
              const userData = {
                role:"user",
                // Add more data as needed
              };
  
              await setDoc(userDocRef, userData, { merge: true });
            }
          } catch (error) {
            console.error("Error pushing user data to Firestore:", error);
          }
        };
  
        pushUserDataToFirestore();
      }
    }, [isLoggedIn]);
  
    // ... (your render code)
    return (
      <div className="container">
        <p className="register-title">LOG IN</p>
        <input
          className={`input ${error ? "error-input" : ""}`}
          required
  
          placeholder="Email....."
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleInputFocus}
        />
        <input
          className={`input ${error ? "error-input" : ""}`}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleInputFocus}
        />
        <button className="button" onClick={signIn}>
          Sign In
        </button>
        <button className="button" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
     
  <Link to="/register">   <button className="button">
  Register
      </button></Link>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  };
  
  
  
 