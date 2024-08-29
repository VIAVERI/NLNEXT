import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './EditArticle.css';

const EditArticle = () => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/articles/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch article');
                }
                const data = await response.json();
                console.log('Fetched article:', data);
                setArticle(data);
            } catch (error) {
                console.error("Error fetching article:", error);
                setError("Failed to load article. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArticle(prevArticle => ({
            ...prevArticle,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article),
            });
            if (!response.ok) {
                throw new Error('Failed to update article');
            }

            // Fetch the updated article
            const updatedArticleResponse = await fetch(`http://localhost:5000/api/articles/${id}`);
            if (!updatedArticleResponse.ok) {
                throw new Error('Failed to fetch updated article');
            }
            const updatedArticle = await updatedArticleResponse.json();
            console.log('Updated article:', updatedArticle);

            let partnerId = null;

            // Fetch all partners
            const partnerResponse = await fetch(`http://localhost:5000/api/partners`);
            if (partnerResponse.ok) {
                const partners = await partnerResponse.json();
                console.log('Fetched partners:', partners);

                // Find the partner whose name matches the article's author
                const matchingPartner = partners.find(partner => partner.name === updatedArticle.author);
                if (matchingPartner) {
                    partnerId = matchingPartner.partner_id;
                }
            }

            console.log('Final partnerId:', partnerId);

            // Navigate back to the partner profile or partners list
            if (partnerId) {
                history.push(`/partner-profile/${partnerId}`);
            } else {
                console.log('No matching partner found, redirecting to partners list');
                history.push('/partners');
            }
        } catch (error) {
            console.error("Error updating article:", error);
            setError("Failed to update article. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!article) return <div className="not-found">Article not found</div>;

    return (
        <div className="edit-article-page">
            <h1>Edit Article</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={article.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={article.content}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={article.category}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image_url">Image URL:</label>
                    <input
                        type="url"
                        id="image_url"
                        name="image_url"
                        value={article.image_url}
                        onChange={handleInputChange}
                    />
                </div>
                {article.image_url && (
                    <div className="image-preview">
                        <img src={article.image_url} alt="Article" />
                    </div>
                )}
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Article'}
                </button>
            </form>
        </div>
    );
};

export default EditArticle;