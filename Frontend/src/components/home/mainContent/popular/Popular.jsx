import React, { useEffect, useState } from "react";
import "./Popular.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Heading from "../../../common/heading/Heading";
import { Heart } from 'lucide-react';

const Popular = () => {
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState({});
  const partnerId = 1; // Replace with actual partner ID from authentication

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/popular");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites?partnerId=${partnerId}`);
        const data = await response.json();
        const favoriteMap = data.reduce((acc, fav) => {
          acc[fav.article_id] = true;
          return acc;
        }, {});
        setFavorites(favoriteMap);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchArticles();
    fetchFavorites();
  }, [partnerId]);

  const toggleFavorite = async (articleId) => {
    try {
      if (favorites[articleId]) {
        await fetch(`http://localhost:5000/api/favorites/${articleId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partnerId })
        });
      } else {
        await fetch('http://localhost:5000/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partnerId, articleId })
        });
      }
      setFavorites(prev => ({
        ...prev,
        [articleId]: !prev[articleId]
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const settings = {
    className: "center",
    centerMode: false,
    infinite: true,
    centerPadding: "0",
    slidesToShow: 2,
    speed: 500,
    rows: 4,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 4,
        },
      },
    ],
  };

  const getImageSource = (article) => {
    if (article.image_url) {
      return article.image_url;
    } else if (article.image_data) {
      return `data:image/jpeg;base64,${article.image_data}`;
    }
    return null; // Return null if no image is available
  };

  return (
    <section className="popular">
      <Heading title="Popular" />
      <div className="content">
        <Slider {...settings}>
          {articles.map((article) => (
            <div className="items" key={article.article_id}>
              <div className="box shadow">
                <div className="images row">
                  <div className="img">
                    {getImageSource(article) && (
                      <img src={getImageSource(article)} alt={article.title} />
                    )}
                  </div>
                  <div className="category category1">
                    <span>{article.category}</span>
                  </div>
                </div>
                <div className="text row">
                  <h1 className="title">{article.title.slice(0, 40)}...</h1>
                  <div className="date">
                    <i className="fas fa-calendar-days"></i>
                    <label>{new Date(article.published_at).toLocaleDateString()}</label>
                  </div>
                  <div className="comment">
                    <i className="fas fa-comments"></i>
                    <label>{article.rating}</label>
                  </div>
                  <Heart
                    size={16}
                    className={`favorite-icon ${favorites[article.article_id] ? 'favorite' : ''}`}
                    onClick={() => toggleFavorite(article.article_id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Popular;