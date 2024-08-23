import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SinglePartnerPage.css';
import OurServices from './components/OurServices';
import ContactUs from './components/ContactUs';
import Heading from "../common/heading/Heading"
import RelatedPosts from './components/RelatedPosts';

const SinglePartnerPage = () => {
    const [partner, setPartner] = useState(null);
    const [partnerServices, setPartnerServices] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { partnerId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const partnerResponse = await fetch(`http://localhost:5000/api/partners/${partnerId}`);
                const servicesResponse = await fetch(`http://localhost:5000/api/services/partner/${partnerId}`);
                const postsResponse = await fetch(`http://localhost:5000/api/articles?author=${partnerId}`);

                if (!partnerResponse.ok || !servicesResponse.ok || !postsResponse.ok) {
                    throw new Error(`Failed to fetch data`);
                }

                const partnerData = await partnerResponse.json();
                const servicesData = await servicesResponse.json();
                const postsData = await postsResponse.json();

                setPartner(partnerData);
                setPartnerServices(servicesData);
                setRelatedPosts(postsData.filter(post => post.author === partnerData.name));
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                            <div className="partner-description">{partner.slogan}</div>
                        </div>
                    </div>
                </div>
                <div className="partner-key-points-w">
                    <ul>
                        {partner.key_points && partner.key_points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
                <div className="partner-map-overlay">
                    <img
                        src="https://www.worldeasyguides.com/wp-content/uploads/2014/04/Where-is-Tilburg-on-map-Netherlands-457x480.jpg"
                        alt="Partner Location Map"
                        className="partner-map-image"
                    />
                    <div className="address">
                        <p>{partner.address}</p>
                    </div>
                </div>
            </div>
            <div className="partner-content-s">
                <div className="partner-main">
                    <h2 className="partner-headline">{partner.headline || "Innovating for a brighter future"}</h2>
                    <div className="partner-description-s">
                        <p>{partner.description}</p>

                        <div className="highlight-quote">
                            <p>{partner.highlight || "Innovation is not just about new products. It's about reinventing business processes and building entirely new markets that meet untapped customer needs."}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="services-container">
                <Heading title='Our Services' />
                <OurServices services={partnerServices} />
            </div>

            <div className="m-container">
                <RelatedPosts posts={relatedPosts} />
            </div>

            <div className="m-container">
                <Heading title='Contact Us' />
                <ContactUs partner={partner} />
            </div>
        </div>
    );
};

export default SinglePartnerPage;