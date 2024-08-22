import React, { useState, useEffect } from "react";
import axios from "axios";
import "./partners.css";
import CreateAccount from "./PartnerAcc";
import { Shield, ChevronDown } from "lucide-react";

const AccountCard = ({ account, onStatusUpdate, isPartner }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      const endpoint = isPartner
        ? `http://localhost:5000/api/partners_acc/${account.id}/status`
        : `http://localhost:5000/api/users/${account.id}/status`;
      await axios.put(endpoint, { status: newStatus });
      onStatusUpdate(account.id, newStatus);
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      // You might want to show an error notification here
    }
  };

  return (
    <div className="ptn-card">
      <img
        src={account.profile_image_url || "/default-profile.png"}
        alt={`${account.name}'s profile`}
        className="ptn-image"
      />
      <h3 className="ptn-name">{account.name}</h3>
      <p className="ptn-email">{account.email}</p>
      {!isPartner && (
        <p className="ptn-organization">{account.partner_organization}</p>
      )}
      <div className="ptn-status-container">
        <span
          className={`ptn-status ptn-${
            account.account_status?.toLowerCase() ||
            account.status?.toLowerCase()
          }`}
        >
          {account.account_status || account.status}
        </span>
        <button
          className="ptn-status-update-btn"
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
        >
          <Shield size={16} />
          <ChevronDown size={16} />
        </button>
        {isStatusDropdownOpen && (
          <div className="ptn-status-dropdown">
            <button
              className="ptn-status-option ptn-active"
              onClick={() => handleStatusChange("Active")}
            >
              Active
            </button>
            <button
              className="ptn-status-option ptn-inactive"
              onClick={() => handleStatusChange("Inactive")}
            >
              Inactive
            </button>
            <button
              className="ptn-status-option ptn-pending"
              onClick={() => handleStatusChange("Pending")}
            >
              Pending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Partners = () => {
  const [activeTab, setActiveTab] = useState("partners");
  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPartners();
    fetchUsers();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/partners_acc"
      );
      setPartners(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch partners");
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleAccountCreated = (newAccount) => {
    if (activeTab === "partners") {
      setPartners([...partners, newAccount]);
    } else {
      setUsers([...users, newAccount]);
    }
  };

  const handleStatusUpdate = (accountId, newStatus) => {
    if (activeTab === "partners") {
      setPartners(
        partners.map((partner) =>
          partner.id === accountId
            ? { ...partner, account_status: newStatus }
            : partner
        )
      );
    } else {
      setUsers(
        users.map((user) =>
          user.id === accountId ? { ...user, status: newStatus } : user
        )
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ptn-page">
      <div className="ptn-header">
        <div className="ptn-tabs">
          <button
            className={`ptn-tab ${activeTab === "partners" ? "active" : ""}`}
            onClick={() => setActiveTab("partners")}
          >
            Partners
          </button>
          <button
            className={`ptn-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>
        <button onClick={handleCreateAccount} className="ptn-create-btn">
          Create {activeTab === "partners" ? "Partner" : "User"} Account
        </button>
      </div>
      <div className="ptn-grid">
        {activeTab === "partners"
          ? partners.map((partner) => (
              <AccountCard
                key={partner.id}
                account={partner}
                onStatusUpdate={handleStatusUpdate}
                isPartner={true}
              />
            ))
          : users.map((user) => (
              <AccountCard
                key={user.id}
                account={user}
                onStatusUpdate={handleStatusUpdate}
                isPartner={false}
              />
            ))}
      </div>
      {isCreateModalOpen && (
        <CreateAccount
          onClose={handleCloseModal}
          onCreateAccount={handleAccountCreated}
          isPartner={activeTab === "partners"}
        />
      )}
    </div>
  );
};

export default Partners;
