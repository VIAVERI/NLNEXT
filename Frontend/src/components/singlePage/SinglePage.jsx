import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Side from "../home/sideContent/side/Side";
import "../home/mainContent/homes/style.css";
import "./singlepage.css";
import "../home/sideContent/side/side.css";
import SinglePageSlider from "./slider/SinglePageSlider";

const SinglePage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/articles/${id}`
        );
        setItem(response.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!item) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      <SinglePageSlider />
      <div className="container">
        <section className="mainContent details">
          <h1 className="title">{item.title}</h1>

          <div className="author">
            <span>by</span>
            <p> {item.author} on</p>
            <label>{new Date(item.published_at).toLocaleDateString()}</label>
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
            <p>{item.content}</p>
          </div>
          <img src={item.image_url} alt={item.title} />
        </section>
        <section className="sideContent">
          <Side />
        </section>
      </div>
    </main>
  );
};

export default SinglePage;
