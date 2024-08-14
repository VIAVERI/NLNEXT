import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import "./style.css";

const SinglePageSlider = () => {
  const [popularArticles, setPopularArticles] = useState([]);

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/articles");
        setPopularArticles(response.data);
      } catch (error) {
        console.error("Error fetching popular articles:", error);
      }
    };

    fetchPopularArticles();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="singlePopular">
      <div className="content">
        <Slider {...settings}>
          {popularArticles.map((article) => (
            <div className="items" key={article.article_id}>
              <div className="box">
                <div className="images">
                  <img src={article.image_url} alt={article.title} />
                </div>
                <div className="text">
                  <h1 className="title">{article.title}</h1>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SinglePageSlider;
