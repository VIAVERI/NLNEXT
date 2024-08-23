import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Card = ({
  item: { article_id, title, category, author, image_url, image_data, published_at },
}) => {
  const [imageSource, setImageSource] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {

    if (image_data) {
      console.log('Image data:', image_data ? 'Present' : 'Not present');
      console.log('Image URL:', image_url);
      setImageSource(`data:image/jpeg;base64,${image_data}`);
    } else if (image_url) {
      setImageSource(image_url);
    } else {
      setImageSource('path/to/placeholder-image.jpg');
    }
  }, [image_data, image_url]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    setImageSource('path/to/placeholder-image.jpg');
  };

  return (
    <div className="box">
      <div className="img">
        {imageLoading && <div className="loading-placeholder">Loading...</div>}
        {imageError && <div className="error-placeholder">Image failed to load</div>}
        <img
          src={imageSource}
          alt={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
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