import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, Globe, MapPin, Clock } from 'lucide-react';
import './EditPartnerProfile.css';

const EditPartnerProfile = ({ partner, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        email: '',
        address: '',
        phone: '',
        working_hours: '',
        web: '',
        facebook: '',
        instagram: '',
        linkedin: ''
    });

    useEffect(() => {
        if (partner) {
            setFormData({
                email: partner.email || '',
                address: partner.address || '',
                phone: partner.phone || '',
                working_hours: partner.working_hours || '',
                web: partner.web || '',
                facebook: partner.facebook || '',
                instagram: partner.instagram || '',
                linkedin: partner.linkedin || ''
            });
        }
    }, [partner]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="edit-partner-profile">
            <h2>Edit Profile Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail size={16} /> Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">
                            <Phone size={16} /> Phone:
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="address">
                            <MapPin size={16} /> Address:
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="working_hours">
                            <Clock size={16} /> Working Hours:
                        </label>
                        <input
                            type="text"
                            id="working_hours"
                            name="working_hours"
                            value={formData.working_hours}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="web">
                            <Globe size={16} /> Website:
                        </label>
                        <input
                            type="url"
                            id="web"
                            name="web"
                            value={formData.web}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="facebook">
                            <Facebook size={16} /> Facebook:
                        </label>
                        <input
                            type="url"
                            id="facebook"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instagram">
                            <Instagram size={16} /> Instagram:
                        </label>
                        <input
                            type="url"
                            id="instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="linkedin">
                            <Linkedin size={16} /> LinkedIn:
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditPartnerProfile;