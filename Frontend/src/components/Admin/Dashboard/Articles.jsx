import React, { useState, useEffect } from "react";
import axios from "axios";
import "./articles.css";

const ArticleCard = ({ article }) => (
  <div className="art-card">
    <img src={article.image_url} alt={article.title} className="art-image" />
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

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="art-page">
      <div className="art-header">
        <button className="show-filters-btn" onClick={toggleFilter}>
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      <div className="art-content-wrapper">
        <div className="art-main-content">
          <div className="art-grid">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
    </div>
  );
};

export default Articles;
