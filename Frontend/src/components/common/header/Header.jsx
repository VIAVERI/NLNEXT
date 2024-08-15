import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import "./header.css";
import Head from "./Head";
import SignInSignUp from "../../login/login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    document.body.style.overflow = "unset"; // Re-enable scrolling
  };
  const handleSuccessfulLogin = () => {
    closeLoginModal();
  };
  return (
    <>
      <header className={isLoginModalOpen ? "blur" : ""}>
        <div className="container paddingSmall">
          <nav className="navbar">
            <div className="logo">
              <Head />
            </div>
            <ul className={navbar ? "nav-links active" : "nav-links"}>
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/">Home</Link>
              </li>
              <li className={location.pathname === "/culture" ? "active" : ""}>
                <Link to="/culture">Culture</Link>
              </li>
              <li className={location.pathname === "/politics" ? "active" : ""}>
                <Link to="/politics">Politics</Link>
              </li>
              <li className={location.pathname === "/memes" ? "active" : ""}>
                <Link to="/memes">Memes</Link>
              </li>
            </ul>
            <div className="icons">
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
                <span className="slider"></span>
              </label>
              <i className="fa fa-search" aria-hidden="true"></i>
              <div className="profile-icon">
                <img src="https://i.pravatar.cc/150?img=3" alt="Profile" />
              </div>
              <button className="login-button" onClick={openLoginModal}>
                Login
              </button>
            </div>
            <button className="barIcon" onClick={() => setNavbar(!navbar)}>
              {navbar ? (
                <i className="fa fa-times"></i>
              ) : (
                <i className="fa fa-bars"></i>
              )}
            </button>
          </nav>
        </div>
      </header>
      {isLoginModalOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FontAwesomeIcon
              icon={faTimes}
              className="modal-close-icon"
              onClick={closeLoginModal}
            />
            <SignInSignUp onSuccessfulLogin={handleSuccessfulLogin} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
