import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Partners.css';
import OurServices from './components/OurServices';
import Heading from "../common/heading/Heading";
import RelatedPosts from './components/RelatedPosts';  // Import the RelatedPosts component

const PartnersPage = () => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [partnerServices, setPartnerServices] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/partners");
                const data = await response.json();
                const sortedPartners = data.sort((a, b) => a.name.localeCompare(b.name));
                setPartners(sortedPartners);
                if (sortedPartners.length > 0) {
                    setSelectedPartner(sortedPartners[0]);
                }
            } catch (error) {
                console.error("Error fetching partners:", error);
            }
        };

        fetchPartners();
    }, []);

    const handlePartnerClick = async (partner) => {
        setSelectedPartner(partner);
        await fetchPartnerServices(partner.partner_id);
    };

    const fetchPartnerServices = async (partnerId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/services/partner/${partnerId}`);
            const data = await response.json();
            setPartnerServices(data);
        } catch (error) {
            console.error("Error fetching partner services:", error);
        }
    };

    useEffect(() => {
        if (selectedPartner) {
            const fetchRelatedPosts = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/articles?author=${selectedPartner.partner_id}`);
                    const data = await response.json();
                    const filteredPosts = data.filter(post => post.author === selectedPartner.name);
                    setRelatedPosts(filteredPosts);
                } catch (error) {
                    console.error("Error fetching related articles:", error);
                }
            };

            fetchRelatedPosts();
            fetchPartnerServices(selectedPartner.partner_id);
        }
    }, [selectedPartner]);

    const handleLearnMore = () => {
        if (selectedPartner) {
            history.push(`/partner/${selectedPartner.partner_id}`);
        }
    };

    return (
        <div className="partners-page">
            <h1>Onze partners</h1>
            <p className="partners-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>

            <div className="partners-content">
                <div className="partners-grid">
                    {partners.map((partner) => (
                        <div
                            key={partner.partner_id}
                            className={`partner-card ${selectedPartner?.partner_id === partner.partner_id ? 'selected' : ''}`}
                            onClick={() => handlePartnerClick(partner)}
                        >
                            <div className="partner-logo">
                                <img src={partner.profile_image_url || partner.logo_url} alt={partner.name} />
                            </div>
                            <h3 className="partner-name">{partner.name}</h3>
                        </div>
                    ))}
                </div>

                <div className="partners-map">
                    <img
                        src="https://www.worldeasyguides.com/wp-content/uploads/2014/04/Where-is-Tilburg-on-map-Netherlands-457x480.jpg"
                        alt="Partners Map"
                    />
                </div>

                {selectedPartner && (
                    <div className="selected-partner-image">
                        <img
                            src={selectedPartner.image || selectedPartner.profile_image_url}
                            alt={selectedPartner.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = selectedPartner.profile_image_url;
                            }}
                        />
                        <div className="partner-info-overlay">
                            <div className="partner-name-overlay-a">
                                {selectedPartner.name}
                            </div>
                            <div className="partner-description">
                                {selectedPartner.slogan}
                            </div>
                            <button className="learn-more-button" onClick={handleLearnMore}>
                                Learn More
                            </button>
                        </div>
                    </div>
                )}

                <div className="services-container">
                    <Heading title='Our Services' />
                    <OurServices services={partnerServices} />
                </div>

                {selectedPartner && relatedPosts.length > 0 && (
                    <RelatedPosts posts={relatedPosts} />
                )}
            </div>
        </div>
    );
};

export default PartnersPage;