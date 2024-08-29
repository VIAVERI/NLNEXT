import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './PPCreation.css';
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from 'axios';
import { Store } from "react-notifications-component";

const db = getFirestore();
const auth = getAuth();

const PPCreation = () => {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',  // Changed to store URL
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
        slogan: '',
        email: '',
        profile_image_url: ''  // Changed to store URL
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFormData(prevData => ({
                        ...prevData,
                        name: userData.name || '',
                        email: userData.email || ''
                    }));
                }
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
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

    const showNotification = (title, message, type) => {
        Store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: { duration: 5000, onScreen: true },
        });
    };

    const handleSubmit = async () => {
        try {
            // Ensure key_points is an array
            const dataToSubmit = {
                ...formData,
                key_points: Array.isArray(formData.key_points) ? formData.key_points : []
            };

            console.log('Submitting data:', dataToSubmit);

            const response = await axios.post('http://localhost:5000/api/partners', dataToSubmit);

            if (response.status === 201) {
                const result = response.data;
                console.log('Partner profile created:', result);

                // Update Firestore document
                const user = auth.currentUser;
                if (user) {
                    await updateDoc(doc(db, "users", user.uid), {
                        profile_completed: true,
                        partnerId: result.partner_id
                    });
                }

                showNotification(
                    "Success",
                    "Partner profile created successfully!",
                    "success"
                );

                history.push(`/partner-admin`);
            } else {
                throw new Error('Failed to create partner profile');
            }
        } catch (error) {
            console.error('Error creating partner profile:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            showNotification(
                "Error",
                `Failed to create partner profile. ${error.response?.data?.error || error.message}`,
                "danger"
            );
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
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            placeholder="Company Logo URL"
                        />
                        <input
                            className="pp-creation-input"
                            type="url"
                            name="profile_image_url"
                            value={formData.profile_image_url}
                            onChange={handleInputChange}
                            placeholder="Profile Image URL"
                        />
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