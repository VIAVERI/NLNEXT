import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./UserRoles.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partnerOrganization, setPartnerOrganization] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");

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
      const response = await fetch(`/api/users/${partnerOrg}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/employers/create_employe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUserEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create employee");
      }
      const data = await response.json();
      console.log("Employee created successfully:", data);

      // Refresh the list of users
      fetchUsers(await getAuth().currentUser, partnerOrganization);

      // // Optionally send an invitation email
      // sendEmailInvitation(newUserEmail);

      // Close the modal
      setShowAddUserModal(false);
      setNewUserEmail("");
    } catch (error) {
      console.error("Error creating employee:", error);
      setError("Failed to create employee");
    }
  };

  // const sendEmailInvitation = async (email) => {
  //   try {
  //     const response = await fetch("/api/send-invite", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email,
  //         partnerOrganization,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to send email");
  //     }

  //     console.log("Invitation email sent successfully");
  //   } catch (error) {
  //     console.error("Error sending email invitation:", error);
  //     setError("Failed to send email invitation");
  //   }
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management-container">
      <div className="connected-avatars-container">
        {users.map((member) => (
          <div key={member.id} className="avatar-wrapper">
            <div className="avatar-container">
              <img
                src={
                  member.profile_image_url || "https://via.placeholder.com/40"
                }
                alt={member.name}
                className="avatar"
              />
              <div className="email-overlay">
                <span className="email-name">{member.name}</span>
                <span className="email">{member.email}</span>
              </div>
            </div>
            {users.length > 1 && member.id !== users[users.length - 1].id && (
              <div className="connector"></div>
            )}
          </div>
        ))}

        <div className="avatar-wrapper">
          <div
            className="avatar-container add-member"
            onClick={() => setShowAddUserModal(true)}
          >
            <span>+</span>
          </div>
        </div>
      </div>

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
          <button
            className="add-user-button"
            onClick={() => setShowAddUserModal(true)}
          >
            Add User
          </button>
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

      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-modal"
              onClick={() => setShowAddUserModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2>Add New Member</h2>
            <form onSubmit={handleAddUser}>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user's email"
                required
              />
              <button type="submit">Send Invitation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
