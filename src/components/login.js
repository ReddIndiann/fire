import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleInputFocus = () => {
    // Clear the error and reset input styles when the input fields receive focus.
    setError(null);
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the home screen after a successful login
      navigate("/movie"); // Replace "/home" with the actual route for your home screen.
    } catch (err) {
      console.error(err);
      setError(err.message); // Set the error message in state
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
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
      <button className="button" onClick={logout}>
        Logout
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
