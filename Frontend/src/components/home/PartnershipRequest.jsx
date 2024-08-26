import React, { useState } from 'react';

const PartnershipRequest = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        function: '',
        organizationName: '',
        inquiryType: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/partnership-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    function: '',
                    organizationName: '',
                    inquiryType: '',
                });
            } else {
                throw new Error('Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting partnership request:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '15px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: 'none',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
                Become a Partner
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    zIndex: 1,
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <div style={{
                        backgroundColor: '#fefefe',
                        margin: '15% auto',
                        padding: '20px',
                        border: '1px solid #888',
                        width: '80%',
                        maxWidth: '500px',
                        borderRadius: '5px'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Partnership Request</h2>
                        {!submitted ? (
                            <form onSubmit={handleSubmit}>
                                {['firstName', 'lastName', 'function', 'organizationName'].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        name={field}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 20px',
                                            margin: '8px 0',
                                            display: 'inline-block',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                ))}
                                <select
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 20px',
                                        margin: '8px 0',
                                        display: 'inline-block',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">Select Inquiry Type</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="information">More Information</option>
                                </select>
                                <button type="submit" style={{
                                    width: '100%',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '14px 20px',
                                    margin: '8px 0',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    Submit Request
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#4CAF50' }}>
                                <p>Thank you for your interest!</p>
                                <p>We've received your partnership request and will contact you soon.</p>
                            </div>
                        )}
                        <button onClick={() => setShowModal(false)} style={{
                            width: '100%',
                            backgroundColor: '#f44336',
                            color: 'white',
                            padding: '14px 20px',
                            margin: '8px 0',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PartnershipRequest;