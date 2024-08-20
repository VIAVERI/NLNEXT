import React from 'react';
import { Facebook, Linkedin, Instagram, Globe, Phone, MapPin, Mail, Clock } from 'lucide-react';
import './ContactUs.css'

const PartnerContact = ({ partner }) => {
    return (
        <div className="contact-us-container">
            <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="info-item">
                    <i className="fa fa-phone"></i>
                    <p>{partner.phone}</p>
                </div>
                <div className="info-item">
                    <i className="fa fa-map-marker"></i>
                    <p>{partner.address}</p>
                </div>
                <div className="info-item">
                    <i className="fa fa-envelope"></i>
                    <p>{partner.email}</p>
                </div>
                <div className="info-item">
                    <i className="fa fa-globe"></i>
                    <p>{partner.web}</p>
                </div>
                <div className="info-item">
                    <i className="fa fa-clock"></i>
                    <p>{partner.working_hours}</p>
                </div>
            </div>

            <div className="social-media-section">
                <h3>Stay Connected</h3>
                <div className='social-row'>
                    <div className='socBox facebook'>
                        <i className='fab fa-facebook-f'></i>
                        <span>12,740 Likes</span>
                    </div>

                    <div className='socBox twitter'>
                        <i className='fab fa-linkedin'></i>
                        <span>8,700 Followers</span>
                    </div>
                    <div className='socBox instagram'>
                        <i className='fab fa-instagram'></i>
                        <span>22,700 Followers</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartnerContact;