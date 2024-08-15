import React, { useState, useEffect } from "react";
import axios from "axios";
import "./partners.css";

const PartnerCard = ({ partner }) => (
  <div className="partner-card">
    <img
      src={partner.profile_image_url}
      alt={`${partner.name}'s profile`}
      className="partner-image"
    />
    <h3 className="partner-name">{partner.name}</h3>
    <p className="partner-company">{partner.company_name}</p>
    <p className="partner-email">{partner.email}</p>
    <span className={`partner-status ${partner.account_status}`}>
      {partner.account_status}
    </span>
  </div>
);

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchPartners();
  }, []);

  const handleCreatePartner = () => {
    // Implement partner creation logic
    console.log("Creating new partner");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="partners-page">
      <div className="partners-header">
        <button onClick={handleCreatePartner} className="create-partner-btn">
          Create Partner Account
        </button>
      </div>
      <div className="partners-grid">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  );
};

export default Partners;
