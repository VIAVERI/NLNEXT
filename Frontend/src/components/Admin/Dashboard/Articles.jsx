import React, { useState, useEffect } from "react";
import axios from "axios";
import "./articles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const ArticleCard = ({ article, onClick }) => {
  const imageSource = article.image_url || (article.image_data ? `data:image/jpeg;base64,${article.image_data}` : null);

  return (
    <div className="art-card" onClick={() => onClick(article)}>
      {imageSource && <img src={imageSource} alt={article.title} className="art-image" />}
      <div className="art-content">
        <span className="art-category">{article.category}</span>
        <h3 className="art-title">{article.title}</h3>
        <p className="art-excerpt">{article.content.substring(0, 100)}...</p>
        <div className="art-meta">
          <span className="art-author">{article.author}</span>
          <span className="art-date">
            {new Date(article.published_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const ArticlePopup = ({ article, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(article.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/articles/${article.article_id}`,
        {
          status: newStatus,
        }
      );
      setStatus(newStatus);
      onStatusChange(article.id, newStatus);
    } catch (error) {
      console.error("Failed to update article status:", error);
    }
  };

  return (
    <div className="art-popup-overlay">
      <div className="art-popup">
        <button className="art-popup-close" onClick={onClose}>
          &times;
        </button>
        <img
          src={article.image_url || (article.image_data ? `data:image/jpeg;base64,${article.image_data}` : null)}
          alt={article.title}
          className="art-popup-image"
        />
        <h2>{article.title}</h2>
        <p className="art-popup-category">{article.category}</p>
        <p className="art-popup-content">{article.content}</p>
        <div className="art-popup-meta">
          <p>Author: {article.author}</p>
          <p>
            Published: {new Date(article.published_at).toLocaleDateString()}
          </p>
        </div>
        <div className="art-popup-status">
          <p>Current Status: {status}</p>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="published">Published</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setArticles(response.data);
        setFilteredArticles(response.data);

        const uniqueCategories = [
          ...new Set(response.data.map((article) => article.category)),
        ];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch articles");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    let result = articles;

    if (statusFilter !== "all") {
      result = result.filter((article) => article.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((article) => article.category === categoryFilter);
    }

    setFilteredArticles(result);
  }, [statusFilter, categoryFilter, articles]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handlePopupClose = () => {
    setSelectedArticle(null);
  };

  const handleStatusChange = (articleId, newStatus) => {
    const updatedArticles = articles.map((article) =>
      article.id === articleId ? { ...article, status: newStatus } : article
    );
    setArticles(updatedArticles);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="art-page">
      <div className="art-header">
        <button className="show-filters-btn" onClick={toggleFilter}>
          <FontAwesomeIcon icon={faFilter} style={{ marginRight: "8px" }} />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <div className="art-content-wrapper">
        <div className="art-main-content">
          <div className="art-grid">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        </div>
        {isFilterOpen && (
          <div className="art-filter-panel">
            <h3>Filter by Status:</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="unpublished">Unpublished</option>
            </select>

            <h3>Filter by Category:</h3>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {selectedArticle && (
        <ArticlePopup
          article={selectedArticle}
          onClose={handlePopupClose}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Articles;