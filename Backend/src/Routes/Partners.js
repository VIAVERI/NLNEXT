const express = require("express");
const router = express.Router();
const { pool } = require("../db");
// const pool = require("../db");

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
    res
      .status(500)
      .json({ error: "An error occurred while fetching partners" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT p.partner_id, p.name, p.description, p.image, p.address, p.web, p.phone, p.working_hours, p.facebook, p.instagram, p.linkedin,
             p.key_points, p.headline, p.highlight, p.slogan,
             pa.profile_image_url, pa.email
      FROM partner p
      LEFT JOIN partners_account pa ON p.partner_id = pa.partner_id
      WHERE p.partner_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the partner" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, address, phone, working_hours, web } = req.body;

    const result = await pool.query(
      `
      UPDATE partner p
      SET address = $1, phone = $2, working_hours = $3, web = $4
      FROM partners_account pa
      WHERE p.partner_id = pa.partner_id AND p.partner_id = $5
      RETURNING p.*, pa.email
    `,
      [address, phone, working_hours, web, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // Update email in partners_account table
    await pool.query(
      `
      UPDATE partners_account
      SET email = $1
      WHERE partner_id = $2
    `,
      [email, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating partner:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the partner" });
  }
});

module.exports = router;
