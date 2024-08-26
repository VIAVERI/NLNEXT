import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './PPCreation.css';
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const PPCreation = () => {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        profile_image_url: '',
        email: '',
        address: '',
        web: '',
        phone: '',
        working_hours: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        key_points: [''],
        headline: '',
        highlight: '',
        slogan: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileUpload = (e, fieldName) => {
        const file = e.target.files[0];
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: file
        }));
    };

    const handleKeyPointsChange = (index, value) => {
        const newKeyPoints = [...formData.key_points];
        newKeyPoints[index] = value;
        setFormData(prevData => ({
            ...prevData,
            key_points: newKeyPoints
        }));
    };

    const addKeyPoint = () => {
        setFormData(prevData => ({
            ...prevData,
            key_points: [...prevData.key_points, '']
        }));
    };

    const handleNext = () => setStep(step + 1);
    const handlePrevious = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/partners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Partner profile created:', result);

                // Update Firestore document
                const user = auth.currentUser;
                if (user) {
                    await updateDoc(doc(db, "users", user.uid), {
                        profile_completed: true
                    });
                }

                history.push(`/partner-admin`);
            } else {
                throw new Error('Failed to create partner profile');
            }
        } catch (error) {
            console.error('Error creating partner profile:', error);
            // Handle error (show error message to user)
        }
    };
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="pp-creation-step">
                        <h2>Basic Information</h2>
                        <input
                            className="pp-creation-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Company Name"
                        />
                        <textarea
                            className="pp-creation-textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Company Description"
                        />
                        <div className="pp-creation-file-input">
                            <label>Company Logo:</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, 'image')}
                                accept="image/*"
                            />
                        </div>
                        <div className="pp-creation-file-input">
                            <label>Profile Image:</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, 'profile_image_url')}
                                accept="image/*"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="pp-creation-step">
                        <h2>Contact Information</h2>
                        <input
                            className="pp-creation-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            className="pp-creation-input"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                        />
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="web"
                            value={formData.web}
                            onChange={handleInputChange}
                            placeholder="Website"
                        />
                        <input
                            className="pp-creation-input"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                        />
                        <input
                            className="pp-creation-input"
                            type="text"
                            name="working_hours"
                            value={formData.working_hours}
                            onChange={handleInputChange}
                            placeholder="Working Hours"
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="pp-creation-step">
                        <h2>Social Media</h2>
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            placeholder="Facebook URL"
                        />
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="Instagram URL"
                        />
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            placeholder="LinkedIn URL"
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="pp-creation-step">
                        <h2>Key Points</h2>
                        {formData.key_points.map((point, index) => (
                            <div key={index} className="pp-creation-key-points">
                                <input
                                    className="pp-creation-input pp-creation-key-point-input"
                                    type="text"
                                    value={point}
                                    onChange={(e) => handleKeyPointsChange(index, e.target.value)}
                                    placeholder={`Key Point ${index + 1}`}
                                />
                                {index === formData.key_points.length - 1 && (
                                    <button className="pp-creation-add-key-point" onClick={addKeyPoint}>+</button>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 5:
                return (
                    <div className="pp-creation-step">
                        <h2>Additional Information</h2>
                        <input
                            className="pp-creation-input"
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleInputChange}
                            placeholder="Headline"
                        />
                        <textarea
                            className="pp-creation-textarea"
                            name="highlight"
                            value={formData.highlight}
                            onChange={handleInputChange}
                            placeholder="Highlight"
                        />
                        <input
                            className="pp-creation-input"
                            type="text"
                            name="slogan"
                            value={formData.slogan}
                            onChange={handleInputChange}
                            placeholder="Slogan"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pp-creation-container">
            <h1 className="pp-creation-title">Create Your Partner Profile</h1>
            <div className="pp-creation-progress">
                <div className="pp-creation-progress-bar">
                    <div
                        className="pp-creation-progress-fill"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>
                <p className="pp-creation-step-info">Step {step} of 5</p>
            </div>
            {renderStep()}
            <div className="pp-creation-navigation">
                {step > 1 && (
                    <button className="pp-creation-button pp-creation-button-secondary" onClick={handlePrevious}>Previous</button>
                )}
                {step < 5 ? (
                    <button className="pp-creation-button" onClick={handleNext}>Next</button>
                ) : (
                    <button className="pp-creation-button" onClick={handleSubmit}>Submit</button>
                )}
            </div>
        </div>
    );
};

export default PPCreation;