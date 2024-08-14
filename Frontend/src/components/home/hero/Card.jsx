import React from "react";
import { Link } from "react-router-dom";

const Card = ({
  item: { article_id, title, category, author, image_url, published_at },
}) => {
  return (
    <div className="box">
      <div className="img">
        <img src={image_url} alt={title} />
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
