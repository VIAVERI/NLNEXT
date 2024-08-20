const express = require("express");
const router = express.Router();
const pool = require("../db");

// Route to get all partners
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM partner");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching partners" });
  }
});

// Original route to get a single partner by ID (preserved)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM partner WHERE partner_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the partner" });
  }
});

// New route to get a single partner by ID, including their services
router.get("/:id/with-services", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
            SELECT p.*, 
                   COALESCE(json_agg(
                       json_build_object(
                           'service_id', s.service_id,
                           'name', s.name,
                           'description', s.description
                       ) ORDER BY s.service_id
                   ) FILTER (WHERE s.service_id IS NOT NULL), '[]') AS services
            FROM partner p
            LEFT JOIN partner_services ps ON p.partner_id = ps.partner_id
            LEFT JOIN services s ON ps.service_id = s.service_id
            WHERE p.partner_id = $1
            GROUP BY p.partner_id
        `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while fetching the partner with services",
    });
  }
});

// New route to add a service to a partner
router.post("/:id/services", async (req, res) => {
  try {
    const { id } = req.params;
    const { service_id } = req.body;

    const result = await pool.query(
      "INSERT INTO partner_services (partner_id, service_id) VALUES ($1, $2) RETURNING *",
      [id, service_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while adding the service to the partner",
    });
  }
});

module.exports = router;
