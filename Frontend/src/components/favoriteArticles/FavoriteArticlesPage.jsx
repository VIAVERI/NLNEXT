import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Heart, Calendar } from "lucide-react";
import Side from "../home/sideContent/side/Side";
import "./FavoriteArticlesPage.css";

const ArticleCard = ({ article }) => (
  <div className="article-card">
    <div className="article-image">
      <img src={article.image_url} alt={article.title} />
      {article.rating && (
        <div className="article-rating">{article.rating}</div>
      )}
      <div className="favorite-icon">
        <Heart size={24} color="red" fill="red" />
      </div>
    </div>
    <div className="article-content">
      <h3 className="article-title">{article.title}</h3>
      <div className="article-meta">
        <img src={article.author_image} alt={article.author} className="author-image" />
        <span className="article-author">{article.author}</span>
        <div className="article-date">
          <Calendar size={16} />
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
        </div>
        <div className="article-comments">
          <MessageSquare size={16} />
          <span>{article.comment_count}</span>
        </div>
      </div>
      <p className="article-excerpt">{article.content.substring(0, 150)}...</p>
    </div>
  </div>
);

const FavoriteArticlesPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const groupedArticles = articles.reduce((acc, article) => {
    (acc[article.category] = acc[article.category] || []).push(article);
    return acc;
  }, {});

  return (
    <main className="favorite-articles-page">
      <div className="container">
        <section className="mainContent">
          {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
            <div key={category} className="category-section">
              <div className="articles-wrapper">
                <h2 className="category-title">{category.toUpperCase()}</h2>

                <div className="articles-container">
                  {categoryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
    </main>
  );
};

export default FavoriteArticlesPage;