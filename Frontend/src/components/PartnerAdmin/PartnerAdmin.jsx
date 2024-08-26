import React from "react";
import "./PartnerAdmin.css";

const dummyData = {
  name: "Acme Corporation",
  domain: "acme.com",
  totalUsers: 10000,
  activeUsers: 8500,
  totalContent: 1200,
  totalRoles: 25,
  recentActivity: [
    { user: "John Doe", action: "Created new article", date: "2023-08-24" },
    { user: "Jane Smith", action: "Updated user roles", date: "2023-08-23" },
    { user: "Bob Johnson", action: "Invited new user", date: "2023-08-22" },
    { user: "Alice Brown", action: "Published content", date: "2023-08-21" },
    { user: "Charlie Wilson", action: "Modified settings", date: "2023-08-20" },
  ],
};

const PartnerAdminDashboard = () => {
  return (
    <div className="pad-dashboard">
      <aside className="pad-sidebar">
        <nav>
          <a href="#" className="pad-nav-item">
            Overview
          </a>
          <a href="#" className="pad-nav-item">
            Manage Content
          </a>
          <a href="#" className="pad-nav-item">
            Users & Roles
          </a>
          <a href="#" className="pad-nav-item">
            Organization Profile
          </a>
          <a href="#" className="pad-nav-item">
            Analytics
          </a>
        </nav>
      </aside>
      <main className="pad-main-content">
        <div className="pad-header">
          <div>
            <h1>{dummyData.name}</h1>
            <p>
              {dummyData.domain} • {dummyData.totalUsers} users
            </p>
          </div>
          <button className="pad-invite-button">Invite User</button>
        </div>

        <div className="pad-metrics">
          <div className="pad-card">
            <h2>Active Users</h2>
            <p className="pad-metric">{dummyData.activeUsers}</p>
          </div>
          <div className="pad-card">
            <h2>Total Content</h2>
            <p className="pad-metric">{dummyData.totalContent}</p>
          </div>
          <div className="pad-card">
            <h2>Roles</h2>
            <p className="pad-metric">{dummyData.totalRoles}</p>
          </div>
        </div>

        <div className="pad-card pad-activity">
          <h2>Recent Activity</h2>
          <ul>
            {dummyData.recentActivity.map((activity, index) => (
              <li key={index}>
                <div>
                  <p className="pad-activity-user">{activity.user}</p>
                  <p className="pad-activity-action">{activity.action}</p>
                </div>
                <span className="pad-activity-date">{activity.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PartnerAdminDashboard;
