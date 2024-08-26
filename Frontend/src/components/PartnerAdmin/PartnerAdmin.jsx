import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faNewspaper,
  faUserFriends,
  faUserTag,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import "./PartnerAdmin.css";
import logo from "../../assets/logo.png";
import UsersAndRoles from "./UserRoles";

// Firebase imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PartnerAdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Overview");
  const [userPhotoURL, setUserPhotoURL] = useState(
    "https://via.placeholder.com/40x40"
  );
  const [partner, setPartner] = useState(null);
  const history = useHistory();

  const sidebarItems = [
    { name: "Overview", icon: faChartLine },
    { name: "Manage Content", icon: faNewspaper },
    { name: "Users & Roles", icon: faUserFriends },
    { name: "Organization Profile", icon: faBuilding },
    { name: "Analytics", icon: faUserTag },
  ];

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.image) {
              setUserPhotoURL(userData.image);
            }
            if (userData.email) {
              fetchPartnerData(userData.email);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserPhotoURL("https://via.placeholder.com/40x40");
        }
      } else {
        setUserPhotoURL("https://via.placeholder.com/40x40");
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

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    if (itemName === "Organization Profile" && partner) {
      history.push(`/partner-profile/${partner.partner_id}`);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Users & Roles":
        return <UsersAndRoles />;
      case "Overview":
        return <h2>Overview Content</h2>;
      case "Manage Content":
        return <h2>Manage Content Page</h2>;
      case "Organization Profile":
        return <h2>Organization Profile Page</h2>;
      case "Analytics":
        return <h2>Analytics Page</h2>;
      default:
        return <p>Content for {activeItem} will be displayed here.</p>;
    }
  };

  return (
    <div className="partner-admin-dashboard">
      <aside className="partner-sidebar">
        <div className="partner-sidebar-header">
          <img src={logo} alt="NLnext Logo" className="partner-sidebar-logo" />
          <h1 className="partner-sidebar-title">Partner Dashboard</h1>
        </div>
        <nav className="partner-sidebar-nav">
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item.name}
                className={activeItem === item.name ? "active" : ""}
                onClick={() => handleItemClick(item.name)}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="partner-sidebar-icon"
                />
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="partner-main-content">
        <header className="partner-main-header">
          <h2 className="partner-page-title">{activeItem}</h2>
          <div className="partner-header-actions">
            <img
              src={userPhotoURL}
              alt="User"
              className="partner-user-avatar"
            />
          </div>
        </header>
        <div className="partner-content-area">{renderContent()}</div>
      </main>
    </div>
  );
};

export default PartnerAdminDashboard;
