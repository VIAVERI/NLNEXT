import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./UserRoles.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partnerOrganization, setPartnerOrganization] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPartnerOrganization(user);
      } else {
        setLoading(false);
        setError("User not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPartnerOrganization = async (user) => {
    try {
      const db = getFirestore();
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const partnerOrg = userSnap.data().partner_organization;
        setPartnerOrganization(partnerOrg);
        fetchUsers(user, partnerOrg);
      } else {
        setError("User data not found in Firestore");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partner organization:", error);
      setError("Failed to fetch partner organization");
      setLoading(false);
    }
  };

  const fetchUsers = async (user, partnerOrg) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/users/${partnerOrg}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <div className="connected-avatars-container">
        {users.map((member) => (
          <div key={member.id} className="avatar-wrapper">
            <div className="avatar-container">
              <img
                src={member.profile_image_url}
                alt={member.name}
                className="avatar"
              />
              <div className="email-overlay">
                <span className="email-name">{member.name}</span>
                <span className="email">{member.email}</span>
              </div>
            </div>
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

      {/* <p>{partnerOrganization || "Not set"}</p> */}
      <section className="all-users-section">
        <div className="table-controls">
          <div className="u-search-container">
            <input
              type="text"
              placeholder="Search User"
              className="u-search-input"
            />
            <button className="u-search-button">🔍</button>
          </div>
          <button className="add-user-button">Add User</button>
        </div>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>User Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-info">
                  <img
                    src={
                      user.profile_image_url || "https://via.placeholder.com/40"
                    }
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div>
                    <p className="user-name">{user.name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </td>
                <td>
                  <span className={`role-tag ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button className="action-button edit">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button className="action-button delete">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserManagement;
