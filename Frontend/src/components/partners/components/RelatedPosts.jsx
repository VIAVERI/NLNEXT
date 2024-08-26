import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Heading from "../../common/heading/Heading";
import { Edit } from 'lucide-react';
import './RelatedPosts.css';

const RelatedPosts = ({ posts, isPartnerProfile = false }) => {
    const history = useHistory();

    const settings = {
        dots: true,
        infinite: posts.length > 3,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: posts.length > 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: posts.length > 1,
                }
            }
        ]
    };

    const handleEditClick = (postId) => {
        history.push(`/edit-article/${postId}`);
    };

    return (
        <section className='popularPost life'>
            <Heading title='Related Articles' />
            <div className='content'>
                {posts.length > 0 ? (
                    <Slider {...settings}>
                        {posts.map((post) => (
                            <div className='items' key={post.article_id}>
                                <div className='box shadow'>
                                    <div className='images'>
                                        <div className='img'>
                                            <img src={post.image_url} alt={post.title} />
                                        </div>
                                        <div className='category category1'>
                                            <span>{post.category}</span>
                                        </div>
                                        {isPartnerProfile && (
                                            <button
                                                className='edit-button'
                                                onClick={() => handleEditClick(post.article_id)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className='text'>
                                        <Link to={`/singlepage/${post.article_id}`}>
                                            <h1 className='title'>{post.title.slice(0, 40)}...</h1>
                                        </Link>
                                        <div className='date'>
                                            <i className='fas fa-calendar-days'></i>
                                            <label>{new Date(post.published_at).toLocaleDateString()}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>No related articles found.</p>
                )}
            </div>
        </section>
    );
};

export default RelatedPosts;