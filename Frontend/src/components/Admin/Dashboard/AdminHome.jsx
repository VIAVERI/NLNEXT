import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faNewspaper,
  faUserFriends,
  faUserTag,
  faDatabase,
  faExclamationTriangle,
  faBolt,
  faHomeAlt,
  faLaptopHouse,
  faHandsHelping,
  faNetworkWired,
  faCubes,
} from "@fortawesome/free-solid-svg-icons";
import "./admin.css";
import logo from "../../../assets/logo.png";
import Articles from "./Articles";
import Partners from "./Partners";
import Services from "./Services";

import Dashboard from "./Dashboard";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Blog Posts");

  const sidebarItems = [
    { name: "Dashboard", icon: faChartLine },
    { name: "Articles", icon: faNewspaper },
    { name: "Services", icon: faNetworkWired },
    { name: "Partner Accounts", icon: faUserFriends },
    { name: "Leads", icon: faUserTag },
    { name: "Source", icon: faDatabase },
    { name: "Errors", icon: faExclamationTriangle },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "Articles":
        return <Articles />;

      case "Partner Accounts":
        return <Partners />;

      case "Dashboard":
        return <Dashboard />;

      case "Services":
        return <Services />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="NLnext Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item.name}
                className={activeItem === item.name ? "active" : ""}
                onClick={() => setActiveItem(item.name)}
              >
                <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h2 className="page-title">{activeItem}</h2>
          <div className="header-actions">
            {/* <input
              type="text"
              placeholder="Search for something..."
              className="search-input"
            /> */}
            <img
              src="https://via.placeholder.com/40x40"
              alt="User"
              className="user-avatar"
            />
          </div>
        </header>
        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
