const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust this path to your database connection file

router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchQuery = `%${q}%`;

        // Search articles
        const articleResults = await pool.query(
            `SELECT article_id, title, category, author, published_at, image_url
       FROM ARTICLE 
       WHERE title ILIKE $1 OR content ILIKE $1 OR category ILIKE $1
       LIMIT 10`,
            [searchQuery]
        );

        // Search topics (categories)
        const topicResults = await pool.query(
            `SELECT DISTINCT category as id, category as name
       FROM ARTICLE 
       WHERE category ILIKE $1
       LIMIT 5`,
            [searchQuery]
        );

        // Search partners
        const partnerResults = await pool.query(
            `SELECT partner_id, name, profile_image_url, slogan
       FROM PARTNER 
       WHERE name ILIKE $1 OR description ILIKE $1
       LIMIT 5`,
            [searchQuery]
        );

        res.json({
            articles: articleResults.rows,
            topics: topicResults.rows,
            partners: partnerResults.rows
        });
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ error: 'An error occurred while performing the search' });
    }
});

module.exports = router;