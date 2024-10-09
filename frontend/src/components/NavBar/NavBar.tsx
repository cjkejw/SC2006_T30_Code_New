import React, { useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/">
        <div className="logo-wrapper">
          <span className="circlelogo"></span>
          <span className="whiteboxtoplogo"></span>
          <span className="whiteboxbottomlogo"></span>
        </div>
      </Link>

      <ul className="navbar__links">
        <li>
          <Link to="/schools">SCHOOLS</Link>
        </li>
        <li>
          <Link to="/compare-schools">COMPARE SCHOOLS</Link>
        </li>
        <li>
          <Link to="/recommendations">RECOMMENDATIONS</Link>
        </li>
        <li>
          <Link to="/forum">FORUM</Link>
        </li>
      </ul>

      <div className="navbar__auth">
        {isLoggedIn ? (
          // Logged-in view: show profile icon
          <div className="navbar__profile">
            <div className="profile-icon">
              <div className="profile-circle"></div>
              <div className="profile-shoulders"></div>
            </div>
          </div>
        ) : (
          // Logged-out view: show Sign In and Sign Up buttons
          <div className="auth-buttons">
            <Link to="/signin" className="signin-rectangle">
              SIGN IN
            </Link>
            <Link to="/signup" className="signup-rectangle">
              SIGN UP
            </Link>
          </div>
        )}
      </div>

      {/* a button to manually toggle login state (for testing purposes) */}
      {/* <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "Logout" : "Login"}
      </button> */}
    </nav>
  );
};

export default NavBar;
