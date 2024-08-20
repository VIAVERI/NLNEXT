import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SinglePartnerPage.css';
import OurServices from './OurServices';
import ContactUs from './ContactUs';
import Heading from "../common/heading/Heading"

const SinglePartnerPage = () => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { partnerId } = useParams();

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/partners/${partnerId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch partner data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setPartner(data);
            } catch (error) {
                console.error("Error fetching partner:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, [partnerId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!partner) return <div>No partner data found.</div>;

    return (
        <div className="single-partner-page">
            <div className="partner-header-wrapper">
                <div className="partner-header">
                    <div className="partner-image-container">
                        <img
                            src={partner.image || partner.profile_image_url}
                            alt={partner.name}
                            className="partner-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = partner.profile_image_url;
                            }}
                        />
                        <div className="partner-name-overlay">
                            <div className="partner-name">{partner.name}</div>
                            <div className="partner-description">{partner.description}</div>
                        </div>
                    </div>
                </div>
                <div className="partner-key-points">
                    <ul>
                        <li>High-quality repairs and maintenance</li>
                        <li>Experienced and trained technicians</li>
                        <li>Quality organization behind quality products</li>
                        <li>Dedicated to helping you achieve maximum efficiency</li>
                    </ul>
                </div>
                <div className="partner-map-overlay">
                    <img
                        src="https://www.worldeasyguides.com/wp-content/uploads/2014/04/Where-is-Tilburg-on-map-Netherlands-457x480.jpg"
                        alt="Partner Location Map"
                        className="partner-map-image"
                    />
                    <div className="partner-contact-info">
                        <p>{partner.address}</p>
                    </div>
                </div>
            </div>
            <div className="partner-content">
                <div className="partner-main">
                    <h2 className="partner-headline">Innovating for a brighter future</h2>
                    <div className="partner-description-s">
                        <p>Our teams are up to date with the latest technologies, media trends and are keen to prove themselves in this industry. That's what you want from a partner, not someone who is relying on the same way of doing things that worked 10 years, 5 years or even a year ago.</p>

                        <div className="highlight-quote">
                            <p>Innovation is not just about new products. It's about reinventing business processes and building entirely new markets that meet untapped customer needs.</p>
                        </div>

                        <p>In an ideal world, every collaboration would start with a deep understanding of needs. However, in reality, some project schedules and budgets don't allow for extensive research. That's where our expertise comes in - we bridge the gap between ideal scenarios and practical constraints, delivering solutions that exceed expectations.</p>
                    </div>
                </div>
            </div>

            <div className="s-container">
                <Heading title='Our Services' />
                <OurServices />
            </div>
            <div className="s-container">
                <Heading title='Contact Us' />
                <ContactUs partner={partner} />
            </div>
        </div>
    );
};

export default SinglePartnerPage;