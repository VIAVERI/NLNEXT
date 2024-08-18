import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Slider from "react-slick";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Partners.css';
import OurServices from './OurServices';
import Heading from "../common/heading/Heading"

const PartnersPage = () => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 51.560514, lng: 5.091052 }); // Default to Tilburg
    const history = useHistory();

    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/partners");
                const data = await response.json();
                setPartners(data);
                if (data.length > 0) {
                    setSelectedPartner(data[0]);
                    if (data[0].latitude && data[0].longitude) {
                        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
                    }
                }
            } catch (error) {
                console.error("Error fetching partners:", error);
            }
        };

        fetchPartners();
    }, []);

    const handlePartnerClick = (partner) => {
        setSelectedPartner(partner);
        if (partner.latitude && partner.longitude) {
            setMapCenter({ lat: partner.latitude, lng: partner.longitude });
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
                    console.error("Error fetching related posts:", error);
                }
            };

            fetchRelatedPosts();
        }
    }, [selectedPartner]);

    const handleLearnMore = () => {
        if (selectedPartner) {
            history.push(`/partner/${selectedPartner.partner_id}`);
        }
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
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
                                <img src={partner.logo_url} alt={partner.name} />
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
                        <img src={selectedPartner.image} alt={selectedPartner.name} />
                        <div className="partner-info-overlay">
                            <div className="partner-name-overlay-a">
                                {selectedPartner.name}
                            </div>
                            <div className="partner-description">
                                {selectedPartner.description}
                            </div>
                            <button className="learn-more-button" onClick={handleLearnMore}>
                                Learn More
                            </button>
                        </div>
                    </div>
                )}


                <div className="services-container">
                    <Heading title='Our Services' />
                    <OurServices />
                </div>

                {selectedPartner && relatedPosts.length > 0 && (
                    <section className='popularPost life'>
                        <Heading title='Related Posts' />
                        <div className='content'>
                            <Slider {...settings}>
                                {relatedPosts.map((post) => (
                                    <div className='items' key={post.article_id}>
                                        <div className='box shadow'>
                                            <div className='images'>
                                                <div className='img'>
                                                    <img src={post.image_url} alt={post.title} />
                                                </div>
                                                <div className='category category1'>
                                                    <span>{post.category}</span>
                                                </div>
                                            </div>
                                            <div className='text'>
                                                <h1 className='title'>{post.title.slice(0, 40)}...</h1>
                                                <div className='date'>
                                                    <i className='fas fa-calendar-days'></i>
                                                    <label>{new Date(post.published_at).toLocaleDateString()}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </section>
                )}
                {selectedPartner && (
                    <div className="load-more-container">
                        <button className="load-more-button" >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnersPage;
