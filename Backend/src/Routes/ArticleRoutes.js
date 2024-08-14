const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the shared pool instance

// Route to get all articles
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM article');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching articles' });
    }
});

module.exports = router;
