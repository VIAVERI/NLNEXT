import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import "./header.css";
import Head from "./Head";
import SignInSignUp from "../../login/login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../../../firebase";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed. User:", user);
      setUser(user);
      if (user) {
        fetchPartnerData(user.email);
      } else {
        setPartner(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPartnerData = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/partners`);
      if (!response.ok) {
        throw new Error("Failed to fetch partners data");
      }
      const partners = await response.json();
      const matchingPartner = partners.find((p) => p.email === email);
      setPartner(matchingPartner || null);
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

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

  const navigateToProfile = () => {
    if (user) {
      if (partner) {
        history.push(`/partner-profile/${partner.partner_id}`);
      } else {
        history.push("/profile");
      }
    } else {
      openLoginModal();
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setPartner(null);
    history.push("/");
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
              <li
                className={location.pathname === "/favorites" ? "active" : ""}
              >
                <Link to="/favorites">Favorites</Link>
              </li>
              <li className={location.pathname === "/partners" ? "active" : ""}>
                <Link to="/partners">Partners</Link>
              </li>
              {partner && (
                <li
                  className={
                    location.pathname === "/partner-admin" ? "active" : ""
                  }
                >
                  <Link to="/partner-admin">Partner Portal</Link>
                </li>
              )}
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
              <div className="profile-icon" onClick={navigateToProfile}>
                <img
                  src={
                    partner?.profile_image_url ||
                    user?.photoURL ||
                    "https://i.pravatar.cc/150?img=3"
                  }
                  alt="Profile"
                />
              </div>
              {user ? (
                <button className="login-button" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button className="login-button" onClick={openLoginModal}>
                  Login
                </button>
              )}
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
