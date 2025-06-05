import React, { useContext, useState, useEffect } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopUp = ({ setShowLogin }) => {
  const { url, setToken, setCartItems } = useContext(StoreContext);
  const [currState, setCurrState] = useState(localStorage.getItem("loginState") || "Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    let newUrl = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setCartItems(response.data.cartData);
        localStorage.setItem("cartData", JSON.stringify(response.data.cartData));
        
        const alertMessage = currState === "Login" ? "Login Successful!" : "Account Created Successfully!";
        alert(alertMessage);

        setTimeout(() => {
          setShowLogin(false);
          window.location.reload(); // Reload the page to update the UI
        }, 2000);
      } else {
        setError(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
};
  const toggleState = (state) => {
    setCurrState(state);
    localStorage.setItem("loginState", state);
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close popup" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        {error && <p className='error-message'>{error}</p>}
        {successMessage && <p className='success-message'>{successMessage}</p>}
        <button type='submit' disabled={loading}>{loading ? "Processing..." : currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => toggleState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => toggleState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  );
};

export default LoginPopUp;
