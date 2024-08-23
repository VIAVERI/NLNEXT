import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './EditArticle.css';

const EditArticle = () => {
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`http://localhost:5000/api/articles/${id}`);
            const data = await response.json();
            setArticle(data);
        };
        fetchArticle();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        });
        if (response.ok) {
            history.push('/partner-profile');
        }
    };

    if (!article) return <div className="loading">Loading...</div>;

    return (
        <div className="edit-article-page">
            <h1>Edit Article</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={article.title}
                        onChange={(e) => setArticle({ ...article, title: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={article.content}
                        onChange={(e) => setArticle({ ...article, content: e.target.value })}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={article.category}
                        onChange={(e) => setArticle({ ...article, category: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input
                        type="url"
                        id="imageUrl"
                        value={article.image_url}
                        onChange={(e) => setArticle({ ...article, image_url: e.target.value })}
                    />
                </div>
                {article.image_url && (
                    <div className="image-preview">
                        <img src={article.image_url} alt="Article" />
                    </div>
                )}
                <button type="submit" className="submit-button">Update Article</button>
            </form>
        </div>
    );
};

export default EditArticle;