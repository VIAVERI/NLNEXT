import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import './ContactUs.css'


const ContactUs = ({ partner }) => {
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
            {/* 
            <div className="subscribe-section">
                <h3>Subscribe</h3>
                <div className='subscribe'>
                    <h4 className='title'>Subscribe to our New Stories</h4>
                    <form action=''>
                        <input type='email' placeholder='Email Address...' />
                        <button>
                            <i className='fa fa-paper-plane'></i> SUBMIT
                        </button>
                    </form>
                </div>
            </div> */}
        </div>
    );
};

export default ContactUs;