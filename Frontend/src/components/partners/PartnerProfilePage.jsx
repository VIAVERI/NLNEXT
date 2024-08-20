import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PartnerProfilePage.css';
import './EditPartnerProfile.css';
import Heading from "../common/heading/Heading";
import ContactUs from './ContactUs';
import EditPartnerProfile from './EditPartnerProfile';

const PartnerProfilePage = () => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { partnerId } = useParams();

    useEffect(() => {
        fetchPartnerProfile();
    }, [partnerId]);

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

    const handleSave = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/partners/${partnerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update partner data: ${response.status} ${response.statusText}`);
            }

            const updatedPartner = await response.json();
            setPartner(updatedPartner);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating partner profile:", error);
            setError(error.message);
        }
    };

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
                    {isEditing ? (
                        <EditPartnerProfile
                            partner={partner}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <Heading title="Contact Us" />
                            <div className="partner-contact-info">
                                <p><strong>Email:</strong> {partner.email}</p>
                                <p><strong>Address:</strong> {partner.address}</p>
                                <p><strong>Phone:</strong> {partner.phone || "Not provided"}</p>
                                <p><strong>Working Hours:</strong> {partner.working_hours || "Not provided"}</p>
                                <p><strong>Website:</strong> {partner.web || "Not provided"}</p>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="edit-button">Edit Profile</button>
                            <div className="containerpartner-contact-info">
                                <ContactUs partner={partner} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerProfilePage;