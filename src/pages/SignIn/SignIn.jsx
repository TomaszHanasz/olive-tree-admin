import React, { useState } from "react";
import "./signIn.style.css";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (e) {
      setError(e.message);
      console.log(error);
    }
  };

  return (
    <div className="sign-in__background">
      <div className="sign-in__container">
        <form className="sign-in__form" onSubmit={handleSubmit}>
          <h1>Please sign in</h1>
          <div className="sign-in__input">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="sign-in__input">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn add-dish__btn">
            Sign In
          </button>
        </form>
      </div>
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>
    </div>
  );
};

export default SignIn;
