import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './SubmitArticlePage.css';

const SubmitArticlePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [author, setAuthor] = useState('');
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const authorFromUrl = searchParams.get('author');
        if (authorFromUrl) {
            setAuthor(decodeURIComponent(authorFromUrl));
        }
    }, [location]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        formData.append('author', author);

        if (imageFile) {
            formData.append('image', imageFile);
        } else if (imageUrl) {
            formData.append('image_url', imageUrl);
        }

        try {
            const response = await fetch('http://localhost:5000/api/submit-article', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit article');
            }

            alert('Article submitted successfully!');
            history.push('/partner-profile'); // Replace with the correct route
        } catch (error) {
            console.error('Error submitting article:', error);
            alert('Failed to submit article. Please try again.');
        }
    };

    return (
        <div className="submit-article-page">
            <h1>Submit a New Article</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imageUrl && (
                        <div className="image-preview">
                            <img src={imageUrl} alt="Selected" />
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Or Image URL:</label>
                    <input
                        type="url"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        readOnly
                    />
                </div>
                <button type="submit" className="submit-button">Submit Article</button>
            </form>
        </div>
    );
};

export default SubmitArticlePage;