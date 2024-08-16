import React, { useState, useEffect } from 'react';
import './OurServices.css';

const ServiceCard = ({ name, description, iconUrl }) => (
    <div className="service-card">
        <div className="service-icon-wrapper">
            <img src={iconUrl} alt={name} className="service-icon" />
        </div>
        <h3 className="service-title">{name}</h3>
        <p className="service-description">{description}</p>
    </div>
);

const OurServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/services');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setServices(data);
                setLoading(false);
            } catch (e) {
                console.error("Error fetching services:", e);
                setError('Failed to load services');
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) return <div className="loading">Loading services...</div>;
    if (error) return <div className="error">{error}</div>;

    if (services.length === 0) {
        return (
            <div className="our-services">
                <p className="no-services">No services available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="our-services">
            <div className="services-grid">
                {services.map((service) => (
                    <ServiceCard
                        key={service.service_id}
                        name={service.name}
                        description={service.description}
                        iconUrl={service.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default OurServices;