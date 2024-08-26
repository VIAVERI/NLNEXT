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
    const [showPreview, setShowPreview] = useState(false);
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

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const applyFormatting = (tag) => {
        const textarea = document.getElementById('content');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const beforeText = content.substring(0, start);
        const afterText = content.substring(end);

        const formattedText = `<${tag}>${selectedText}</${tag}>`;
        setContent(beforeText + formattedText + afterText);

        // Reset selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, end + 2 * tag.length + 5);
        }, 0);
    };

    const renderFormattedContent = (text) => {
        return text.replace(/<(\w+)>(.*?)<\/\1>/g, (match, tag, content) => {
            switch (tag) {
                case 'b': return `<strong>${content}</strong>`;
                case 'i': return `<em>${content}</em>`;
                case 'u': return `<u>${content}</u>`;
                default: return match;
            }
        });
    };

    const ArticlePreview = () => (
        <div className="article-preview">
            <h1 className="title">{title}</h1>
            <div className="author">
                <span>by</span>
                <p>{author} on</p>
                <label>{new Date().toLocaleDateString()}</label>
            </div>
            <div className="social">
                <div className="socBox">
                    <i className="fab fa-facebook-f"></i>
                    <span>SHARE</span>
                </div>
                <div className="socBox">
                    <i className="fab fa-twitter"></i>
                    <span>TWITTER</span>
                </div>
                <div className="socBox">
                    <i className="fab fa-pinterest"></i>
                </div>
                <div className="socBox">
                    <i className="fa fa-envelope"></i>
                </div>
            </div>
            <div className="desctop">
                <p dangerouslySetInnerHTML={{ __html: renderFormattedContent(content) }}></p>
            </div>
            {imageUrl && <img src={imageUrl} alt={title} />}
        </div>
    );

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
                    <div className="formatting-toolbar">
                        <button type="button" onClick={() => applyFormatting('b')}>B</button>
                        <button type="button" onClick={() => applyFormatting('i')}>I</button>
                        <button type="button" onClick={() => applyFormatting('u')}>U</button>
                    </div>
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
                <div className="button-group">
                    <button type="button" className="preview-button" onClick={togglePreview}>
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    <button type="submit" className="submit-button">Submit Article</button>
                </div>
            </form>
            {showPreview && <ArticlePreview />}
        </div>
    );
};

export default SubmitArticlePage;