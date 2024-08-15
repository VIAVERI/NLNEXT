import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Partners.css';
import PartnerServices from './PartnerServices';

const PartnersPage = () => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [selectedPartnerImage, setSelectedPartnerImage] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/partners");
                const data = await response.json();
                setPartners(data);
                if (data.length > 0) {
                    setSelectedPartner(data[0]);
                    setSelectedPartnerImage(data[0].logo_url);
                }
            } catch (error) {
                console.error("Error fetching partners:", error);
            }
        };

        fetchPartners();
    }, []);

    useEffect(() => {
        if (selectedPartner) {
            const fetchRelatedPosts = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/articles?author=${selectedPartner.partner_id}`);
                    const data = await response.json();
                    const filteredPosts = data.filter(post => post.author === selectedPartner.name);
                    setRelatedPosts(filteredPosts);
                } catch (error) {
                    console.error("Error fetching related posts:", error);
                }
            };

            fetchRelatedPosts();
        }
    }, [selectedPartner]);

    const handlePartnerClick = (partner) => {
        setSelectedPartner(partner);
        setSelectedPartnerImage(partner.logo_url);
    };

    const handleLearnMore = () => {
        if (selectedPartner) {
            history.push(`/partner/${selectedPartner.partner_id}`);
        }
    };

    return (
        <div className="partners-page">
            <h1>Onze partners</h1>
            <br />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
            < br />            < br />

            <div className="partners-content">
                <div className="row">
                    <div className="column">
                        <div className="partners-list">
                            {partners.map((partner) => (
                                <div
                                    key={partner.partner_id}
                                    className={`partner-card ${selectedPartner?.partner_id === partner.partner_id ? 'selected' : ''}`}
                                    onClick={() => handlePartnerClick(partner)}
                                >
                                    <div className="partner-logo">
                                        <img src={partner.logo_url} alt={partner.name} />
                                    </div>
                                    <div className="partner-details">
                                        <h3 className="partner-name">{partner.name}</h3>
                                        <p className="partner-description-a">{partner.description.slice(0, 60)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="column">
                        <div className="partners-map">
                            <img
                                src="https://www.worldeasyguides.com/wp-content/uploads/2014/04/Where-is-Tilburg-on-map-Netherlands-457x480.jpg"
                                alt="World Map"
                            />
                        </div>
                    </div>
                </div>
                < br />
                <div className="row">
                    {/* New full-width row for selected partner image */}
                    {selectedPartnerImage && (
                        <div className="selected-partner-image">
                            <div className="partner-image-container">
                                <img src={selectedPartnerImage} alt={selectedPartner?.name} />
                                <div className="partner-name-overlay">
                                    {selectedPartner?.name}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
                < br />

                <div className="row">
                    {selectedPartner && <PartnerServices />}

                    {selectedPartner && relatedPosts.length > 0 && (
                        <div className="related-posts">
                            <h2>Related Posts for {selectedPartner.name}</h2>
                            <div className="popular">
                                {relatedPosts.map((post) => (
                                    <div className="items" key={post.article_id}>
                                        <div className="box shadow">
                                            <div className="images row">
                                                <div className="img">
                                                    <img src={post.image_url} alt={post.title} />
                                                </div>
                                                <div className="category category1">
                                                    <span>{post.category}</span>
                                                </div>
                                            </div>
                                            <div className="text row">
                                                <h1 className="title">{post.title.slice(0, 40)}...</h1>
                                                <div className="date">
                                                    <i className="fas fa-calendar-days"></i>
                                                    <label>{new Date(post.published_at).toLocaleDateString()}</label>
                                                </div>
                                                <div className="comment">
                                                    <i className="fas fa-comments"></i>
                                                    <label>{post.rating}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedPartner && relatedPosts.length === 0 && (
                        <div className="related-posts">
                            <h3>No Related Posts for {selectedPartner.name}</h3>
                            <p>There are currently no articles associated with this partner.</p>
                        </div>
                    )}
                </div>

                {selectedPartner && (
                    <div className="learn-more-container">
                        <button className="learn-more-button" onClick={handleLearnMore}>
                            Learn More about {selectedPartner.name}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PartnersPage;
