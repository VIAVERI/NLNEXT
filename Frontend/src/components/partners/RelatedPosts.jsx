import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Heading from "../common/heading/Heading";

const RelatedPosts = ({ posts }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className='popularPost life'>
            <Heading title='Related Articles' />
            <div className='content'>
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
                                </div>
                                <div className='text'>
                                    <h1 className='title'>{post.title.slice(0, 40)}...</h1>
                                    <div className='date'>
                                        <i className='fas fa-calendar-days'></i>
                                        <label>{new Date(post.published_at).toLocaleDateString()}</label>
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

export default RelatedPosts;