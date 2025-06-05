import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    console.log("Logging out...");

    setToken(null);
    setCartItems({}); // Reset cart state

    localStorage.removeItem("token");
    localStorage.removeItem("cartData");

    console.log("localStorage after logout:", localStorage.getItem("cartData"));

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#explore-menu").scrollIntoView({ behavior: "smooth" });
            setMenu("menu");
          }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#app-download").scrollIntoView({ behavior: "smooth" });
            setMenu("mobile-app");
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#footer").scrollIntoView({ behavior: "smooth" });
            setMenu("contact-us");
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search Icon" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Basket Icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile icon" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                Log Out
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
