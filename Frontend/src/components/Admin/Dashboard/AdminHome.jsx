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
} from "@fortawesome/free-solid-svg-icons";
import "./admin.css";
import logo from "../../../assets/logo.png";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Blog Posts");

  const sidebarItems = [
    { name: "Dashboard", icon: faChartLine },
    { name: "Articles", icon: faNewspaper },
    { name: "Partner Accounts", icon: faUserFriends },

    { name: "Leads", icon: faUserTag },
    { name: "Source", icon: faDatabase },
    { name: "Errors", icon: faExclamationTriangle },
  ];

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
            <input
              type="text"
              placeholder="Search for something..."
              className="search-input"
            />
            <img
              src="https://via.placeholder.com/40x40"
              alt="User"
              className="user-avatar"
            />
          </div>
        </header>
        <div className="content-area">
          <p>Content for {activeItem} will be displayed here.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
