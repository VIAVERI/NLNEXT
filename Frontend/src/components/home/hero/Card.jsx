import React from "react";
import { Link } from "react-router-dom";

const Card = ({
  item: { article_id, title, category, author, image_url, published_at },
}) => {
  const imageSource = image_url || "https://via.placeholder.com/300x200";
  console.log("Card imageSource:", imageSource);

  return (
    <div className="box">
      <div
        className="img"
        style={{ width: "100%", height: "200px", overflow: "hidden" }}
      >
        <img
          src={imageSource}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="text">
        <span className="category">{category}</span>
        <Link to={`/SinglePage/${article_id}`}>
          <h1 className="titleBg">{title}</h1>
        </Link>
        <div className="author flex">
          <span>by {author}</span>
          <span>{new Date(published_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
