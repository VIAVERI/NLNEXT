import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PartnerProfilePage.css';
import Heading from "../common/heading/Heading";
import ContactUs from './ContactUs';

const PartnerProfilePage = () => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { partnerId } = useParams();

    useEffect(() => {
        const fetchPartnerProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/partners/${partnerId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch partner data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setPartner(data);
            } catch (error) {
                console.error("Error fetching partner profile:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerProfile();
    }, [partnerId]);

    if (loading) return <div className="loading">Loading partner profile...</div>;
    if (error) return <div className="error">Error loading partner profile: {error}</div>;
    if (!partner) return <div className="not-found">No partner data found for ID: {partnerId}</div>;

    return (
        <div className="partner-profile-page">
            <div className="partner-header-wrapper">
                <div className="partner-header">
                    <img
                        src={partner.image}
                        alt={partner.name}
                        className="partner-image"
                    />
                    <div className="partner-name-overlay">
                        <div className="partner-name">{partner.name}</div>
                        <div className="partner-description">{partner.description}</div>
                    </div>
                </div>
                <div className="profile-image-container">
                    <img
                        src={partner.profile_image_url}
                        alt={`${partner.name} profile`}
                        className="profile-image"
                    />
                </div>
            </div>


            <div className="partner-content">
                <div className="partner-main">


                    <Heading title="Contact Us" />
                    <div className="partner-contact-info">
                        <p><strong>Email:</strong> {partner.email}</p>
                        <p><strong>Address:</strong> {partner.address}</p>
                        <p><strong>Phone:</strong> {partner.phone || "Not provided"}</p>
                    </div>
                    <div className="containerpartner-contact-info">
                        <ContactUs partner={partner} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerProfilePage;