import React, { useEffect, useState } from "react";
import "./Popular.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Heading from "../../../common/heading/Heading";

const Popular = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/articles"); // Ensure this is the correct API endpoint
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

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
                    <img src={article.image_url} alt={article.title} />
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
