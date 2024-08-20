import React, { useState, useEffect } from 'react';

const EditPartnerProfile = ({ partner, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        email: '',
        address: '',
        phone: '',
        working_hours: '',
        web: ''
    });

    useEffect(() => {
        if (partner) {
            setFormData({
                email: partner.email || '',
                address: partner.address || '',
                phone: partner.phone || '',
                working_hours: partner.working_hours || '',
                web: partner.web || ''
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
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
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
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="working_hours">Working Hours:</label>
                    <input
                        type="text"
                        id="working_hours"
                        name="working_hours"
                        value={formData.working_hours}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="web">Website:</label>
                    <input
                        type="url"
                        id="web"
                        name="web"
                        value={formData.web}
                        onChange={handleChange}
                    />
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