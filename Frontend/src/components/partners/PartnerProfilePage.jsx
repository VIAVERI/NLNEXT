import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './PartnerProfilePage.css';
import './EditPartnerProfile.css';
import Heading from "../common/heading/Heading";
import EditPartnerProfile from './EditPartnerProfile';
import OurServices from './components/OurServices';
import PartnerContact from './components/PartnerContact';
import RelatedPosts from './components/RelatedPosts';

const PartnerProfilePage = () => {
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [partnerServices, setPartnerServices] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isPartner, setIsPartner] = useState(false);
    const { partnerId } = useParams();
    const history = useHistory();
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsPartner(userData.role === 'partner');
                }
            } else {
                setIsPartner(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    useEffect(() => {
        const fetchData = async () => {
            if (!partnerId || partnerId === 'null') {
                setError("Invalid partner ID");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                await Promise.all([
                    fetchPartnerProfile(),
                    fetchPartnerServices(),
                    fetchRelatedPosts()
                ]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [partnerId]);

    const fetchPartnerProfile = async () => {
        const response = await fetch(`http://localhost:5000/api/partners/${partnerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch partner data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setPartner(data);
    };

    const fetchPartnerServices = async () => {
        const response = await fetch(`http://localhost:5000/api/services/partner/${partnerId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch partner services: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setPartnerServices(data);
    };

    const fetchRelatedPosts = async () => {
        const response = await fetch(`http://localhost:5000/api/articles`);
        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (partner) {
            const filteredPosts = data.filter(post => post.author === partner.name);
            setRelatedPosts(filteredPosts);
        }
    };

    useEffect(() => {
        if (partner) {
            fetchRelatedPosts();
        }
    }, [partner]);

    const handleSave = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/partners/${partnerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update partner data: ${response.status} ${response.statusText}`);
            }

            const updatedPartner = await response.json();
            setPartner(updatedPartner);
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmitArticle = () => {
        if (partner && partner.name) {
            history.push(`/submit-article?author=${encodeURIComponent(partner.name)}`);
        }
    };

    const handleEditPost = (postId) => {
        history.push(`/edit-article/${postId}?partnerId=${partnerId}`);
    };

    if (loading) return <div className="loading">Loading partner profile...</div>;
    if (error) return <div className="error">Error loading partner profile: {error}</div>;
    if (!partner) return <div className="not-found">No partner data found for ID: {partnerId}</div>;

    return (
        <div className="partner-profile-page">
            <div className="partner-header-wrapper">
                <div className="partner-header">
                    <img src={partner.image} alt={partner.name} className="partner-image" />
                    <div className="partner-name-overlay">
                        <div className="partner-name">{partner.name}</div>
                        <div className="partner-description">{partner.slogan}</div>
                    </div>
                </div>
                <div className="profile-image-container">
                    <img src={partner.profile_image_url} alt={`${partner.name} profile`} className="profile-image" />
                </div>
            </div>
            <div className="partner-key-points">
                <ul>
                    {partner.key_points && partner.key_points.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
            <div className="partner-content-wrapper">
                <div className="partner-content">
                    {isEditing ? (
                        <EditPartnerProfile
                            partner={partner}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <div>
                                <Heading title='Our Services' />
                                <div className="services-container">
                                    <OurServices services={partnerServices} />
                                </div>
                            </div>
                            <div>
                                <RelatedPosts
                                    posts={relatedPosts}
                                    isPartnerProfile={true}
                                    onEditPost={handleEditPost}
                                    partnerId={partnerId}
                                />
                            </div>
                            <div>
                                <Heading title="Contact Us" />
                                <PartnerContact partner={partner} />
                            </div>
                        </>
                    )}
                    <div className="button-container">
                        {isPartner && (
                            <>
                                <button onClick={handleSubmitArticle} className="action-button submit-article-button">
                                    Submit Article
                                </button>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="action-button edit-button"
                                >
                                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerProfilePage;