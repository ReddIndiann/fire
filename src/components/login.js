import { auth, googleProvider,db } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { Link } from "react-router-dom";
import { doc,getDoc } from "firebase/firestore";
export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputFocus = () => {
    setError(null);
  };

  const signIn = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Assuming you have a collection named 'users' in Firestore
      // const userDocRef = doc(db, 'users', user.uid);
      // const userDoc = await getDoc(userDocRef);
      
      // if (userDoc.exists()) {
      //   const userData = userDoc.data();
      //   if (userData.role === 'admin') {
      //     navigate('/options');
      //   } else {
      //     navigate('/buybread');
      //   }
      // }
      navigate('/options');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      // Assuming you have a collection named 'users' in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <p className="register-title">LOG IN</p>
      <input
        className={`input ${error ? "error-input" : ""}`}
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
      <button className="button" onClick={signIn} disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
      <button className="button" onClick={signInWithGoogle} disabled={loading}>
        {loading ? "Signing In..." : "Sign in with Google"}
      </button>
      <Link to="/register">
        <button className="button">Register</button>
      </Link>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};