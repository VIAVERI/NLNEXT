import React, { useState } from "react";
import "./UserRoles.css";

const UserManagement = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Dilsha",
      email: "dilsha@gmail.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    // Add more team members as needed
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Yerry Rosales",
      email: "yerry@example.com",
      roles: ["Manager", "Admin", "Author"],
      loggedIn: false,
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: 2,
      name: "Lennert Nijenbijvank",
      email: "lennert@example.com",
      roles: ["Manager", "Admin"],
      loggedIn: true,
      avatar: "https://i.pravatar.cc/100?img=6",
    },
    {
      id: 3,
      name: "Talan Cotton",
      email: "talan@example.com",
      roles: ["Admin", "Editor"],
      loggedIn: true,
      avatar: "https://i.pravatar.cc/100?img=7",
    },
    {
      id: 4,
      name: "Aubree Azubuike",
      email: "aubree@example.com",
      roles: ["Admin", "Author"],
      loggedIn: false,
      avatar: "https://i.pravatar.cc/100?img=8",
    },
    {
      id: 5,
      name: "Antonin Hafer",
      email: "antonin@example.com",
      roles: ["Manager"],
      loggedIn: true,
      avatar: "https://i.pravatar.cc/100?img=9",
    },
    {
      id: 6,
      name: "Sutanuka Bakaiowits",
      email: "sutanuka@example.com",
      roles: ["Author"],
      loggedIn: true,
      avatar: "https://i.pravatar.cc/100?img=10",
    },
    {
      id: 7,
      name: "Lela Ivankov",
      email: "lela@example.com",
      roles: ["Editor"],
      loggedIn: false,
      avatar: "https://i.pravatar.cc/100?img=11",
    },
    {
      id: 8,
      name: "Nael El Azam",
      email: "nael@example.com",
      roles: ["Author"],
      loggedIn: true,
      avatar: "https://i.pravatar.cc/100?img=12",
    },
  ]);

  return (
    <div className="user-management">
      <div className="connected-avatars-container">
        {teamMembers.map((member) => (
          <div key={member.id} className="avatar-wrapper">
            <div className="avatar-container">
              <img src={member.avatar} alt={member.name} className="avatar" />
              <div className="email-overlay">
                <span className="email-name">{member.name}</span>
                <span className="email">{member.email}</span>
              </div>
            </div>
            {/* Connector line between avatars */}
            {teamMembers.length > 1 &&
              member.id !== teamMembers[teamMembers.length - 1].id && (
                <div className="connector"></div>
              )}
          </div>
        ))}

        <div className="avatar-wrapper">
          <div className="avatar-container add-member">
            <span>+</span>
          </div>
        </div>
      </div>

      <section className="all-users-section">
        <h2>All Users</h2>
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search User"
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
          <button className="add-user-button">Add User</button>
        </div>
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Name</th>
              <th>User Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="user-info">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div>
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                    {!user.loggedIn && (
                      <span className="not-logged-in">Not Logged In</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="user-roles">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`role-tag ${role.toLowerCase()}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button className="action-button edit">⚙️</button>
                  <button className="action-button delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>Showing 7 of 34 total Users</span>
          <div className="pagination-controls">
            <button>First</button>
            <button>10</button>
            <button className="active">11</button>
            <button>...</button>
            <button>25</button>
            <button>26</button>
            <button>Last</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
