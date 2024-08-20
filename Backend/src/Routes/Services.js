const express = require('express');
const router = express.Router();
const pool = require('../db');

// Route to get all services
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching services' });
    }
});

// Route to get services for a specific partner
router.get('/partner/:partnerId', async (req, res) => {
    try {
        const { partnerId } = req.params;
        const result = await pool.query(`
            SELECT s.* 
            FROM services s
            JOIN partner_services ps ON s.service_id = ps.service_id
            WHERE ps.partner_id = $1
        `, [partnerId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching services for the partner' });
    }
});

// Route to get a single service by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM services WHERE service_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the service' });
    }
});

module.exports = router;