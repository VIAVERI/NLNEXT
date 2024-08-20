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

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.partner_id, p.name, p.description, p.image, 
             pa.profile_image_url, pa.email
      FROM partner p
      LEFT JOIN partners_account pa ON p.partner_id = pa.partner_id
      ORDER BY p.partner_id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "An error occurred while fetching partners" });

  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.partner_id, p.name, p.description, p.image, p.address, p.web, p.phone, working_hours, p.facebook, p.instagram, p.linkedin,
             pa.profile_image_url, pa.email
      FROM partner p
      LEFT JOIN partners_account pa ON p.partner_id = pa.partner_id
      WHERE p.partner_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ error: "An error occurred while fetching the partner" });
  }
});

module.exports = router;