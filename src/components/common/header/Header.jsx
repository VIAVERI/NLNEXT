import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";
import Head from "./Head";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();

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

  return (
    <header>
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
  );
};

export default Header;
