import React, { useState, useEffect } from "react";
import axios from "axios";
import "./partners.css";
import CreatePartnerAccount from "./PartnerAcc";
import { Shield, ChevronDown } from "lucide-react";

const PartnerCard = ({ partner, onStatusUpdate }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/partners_acc/${partner.id}/status`,
        {
          status: newStatus,
        }
      );
      onStatusUpdate(partner.id, newStatus);
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      // You might want to show an error notification here
    }
  };

  return (
    <div className="ptn-card">
      <img
        src={partner.profile_image_url}
        alt={`${partner.name}'s profile`}
        className="ptn-image"
      />
      <h3 className="ptn-name">{partner.name}</h3>
      <p className="ptn-email">{partner.email}</p>
      <div className="ptn-status-container">
        <span
          className={`ptn-status ptn-${partner.account_status.toLowerCase()}`}
        >
          {partner.account_status}
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
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPartners();
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

  const handleCreatePartner = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handlePartnerCreated = (newPartner) => {
    setPartners([...partners, newPartner]);
  };

  const handleStatusUpdate = (partnerId, newStatus) => {
    setPartners(
      partners.map((partner) =>
        partner.id === partnerId
          ? { ...partner, account_status: newStatus }
          : partner
      )
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ptn-page">
      <div className="ptn-header">
        <button onClick={handleCreatePartner} className="ptn-create-btn">
          Create Partner Account
        </button>
      </div>
      <div className="ptn-grid">
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
      {isCreateModalOpen && (
        <CreatePartnerAccount
          onClose={handleCloseModal}
          onCreatePartner={handlePartnerCreated}
        />
      )}
    </div>
  );
};

export default Partners;
