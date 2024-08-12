import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import Head from "./Head";

const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <header>
        <div className="container paddingSmall">
          <nav>
            <ul
              className={navbar ? "navbar" : "flex"}
              onClick={() => setNavbar(false)}
            >
              {/* Add other links */}
              <li>
                <Head />
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/culture">Culture</Link>
              </li>
              <li>
                <Link to="/politics">Politics</Link>
              </li>
              <li>
                <Link to="/memes">Memes</Link>
              </li>
              {/* Add more links as needed */}
              <div className="icons">
                {/* Theme Toggle */}
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={theme === "dark"}
                  />
                  <span className="slider"></span>
                </label>

                {/* Search Icon */}
                <i className="fa fa-search" aria-hidden="true"></i>

                {/* Menu Icon */}
                <button className="barIcon" onClick={() => setNavbar(!navbar)}>
                  {navbar ? (
                    <i className="fa fa-times"></i>
                  ) : (
                    <i className="fa fa-bars"></i>
                  )}
                </button>
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
