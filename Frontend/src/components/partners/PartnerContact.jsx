import React from 'react';
import { Facebook, Linkedin, Instagram, Globe, Phone, MapPin, Mail, Clock } from 'lucide-react';
import './ContactUs.css'

const PartnerContact = ({ partner }) => {
    const handleSocialClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="contact-us-container">
            <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="info-item">
                    <Phone size={16} />
                    <p>{partner.phone}</p>
                </div>
                <div className="info-item">
                    <MapPin size={16} />
                    <p>{partner.address}</p>
                </div>
                <div className="info-item">
                    <Mail size={16} />
                    <p>{partner.email}</p>
                </div>
                <div className="info-item">
                    <Globe size={16} />
                    <p>{partner.web}</p>
                </div>
                <div className="info-item">
                    <Clock size={16} />
                    <p>{partner.working_hours}</p>
                </div>
            </div>

            <div className="social-media-section">
                <h3>Stay Connected</h3>
                <div className='social-row'>
                    {partner.facebook && (
                        <div className='socBox facebook' onClick={() => handleSocialClick(partner.facebook)}>
                            <Facebook size={16} />
                            <span>Facebook</span>
                        </div>
                    )}
                    {partner.linkedin && (
                        <div className='socBox twitter' onClick={() => handleSocialClick(partner.linkedin)}>
                            <Linkedin size={16} />
                            <span>LinkedIn</span>
                        </div>
                    )}
                    {partner.instagram && (
                        <div className='socBox instagram' onClick={() => handleSocialClick(partner.instagram)}>
                            <Instagram size={16} />
                            <span>Instagram</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerContact;