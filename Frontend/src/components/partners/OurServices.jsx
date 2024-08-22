import React from 'react';
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

const OurServices = ({ services }) => {
    if (!services || services.length === 0) {
        return (
            <div className="our-services">
                <p className="no-services">No services available for this partner.</p>
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