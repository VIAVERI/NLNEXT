import React from 'react';
import { ArrowDown, Eye, Users, MessageSquare, ThumbsUp } from 'lucide-react';
import './Partners.css';

const ServiceCard = ({ icon: Icon, text }) => (
    <div className="service-card">
        <div className="icon-wrapper">
            <Icon className="service-icon" />
        </div>
        <p className="service-text">{text}</p>
        <p className="service-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque aliquet sem, non fermentum lacus fermentum ut.
        </p>
    </div>
);

const PartnerServices = () => {
    const services = [
        { icon: ArrowDown, text: "See exactly how your food was cultivated" },
        { icon: Eye, text: "Gain visibility into the global food system" },
        { icon: Users, text: "Learn more about brands and their upstream partners" },
        { icon: MessageSquare, text: "Connect with the people who produce your food" },
        { icon: ThumbsUp, text: "Support companies that are doing the right thing" }
    ];

    return (
        <div className="partner-services">
            <h2 className="services-title">Our Services</h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <ServiceCard key={index} icon={service.icon} text={service.text} />
                ))}
            </div>
        </div>
    );
};

export default PartnerServices;
