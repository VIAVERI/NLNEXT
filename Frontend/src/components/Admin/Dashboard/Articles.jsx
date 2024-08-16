import React, { useState, useEffect } from "react";
import axios from "axios";
import "./articles.css"; // We'll create this CSS file for styling

const ArticleCard = ({ article }) => (
  <div className="article-card">
    <img
      src={article.image_url}
      alt={article.title}
      className="article-image"
    />
    <div className="article-content">
      <span className="article-category">{article.category}</span>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-excerpt">{article.content.substring(0, 100)}...</p>
      <div className="article-meta">
        <img
          src={`https://ui-avatars.com/api/?name=${article.author}&background=random`}
          alt={article.author}
          className="author-avatar"
        />
        <span className="article-date">
          {new Date(article.published_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
);

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch articles");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="articles-page">
      <div className="articles-grid">
        {articles.map((article) => (
          <ArticleCard key={article.article_id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Articles;
