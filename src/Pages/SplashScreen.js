import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

import AppLogo from "../Images/Group 28.svg";

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      navigate("/login"); // Navigate to Signup when loading is complete
    }
  }, [loading, navigate]);

  return (
    <div className={`splash-screen ${loading ? "show" : "hide"}`}>
      <div className="Logo-container">
        <img src={AppLogo} alt="App Logo" className="AppLogo" />
        <div className="text-container">
          <h3 className="firsttext">Your Career,</h3>
          <h3 className="secondtext">Streamlined</h3>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;