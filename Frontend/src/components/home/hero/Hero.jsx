import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import "./hero.css";

const Hero = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        const shuffledArticles = response.data.sort(() => 0.5 - Math.random());
        const selectedArticles = shuffledArticles.slice(0, 4);
        setArticles(selectedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="hero">
      <div className="container">
        {articles.map((article) => (
          <Card key={article.article_id} item={article} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
