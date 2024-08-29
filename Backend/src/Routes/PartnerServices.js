const express = require("express");
const router = express.Router();
const { pool } = require("../db");

//get all partner services

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
            partner_id, 
            service_id
        FROM partner_services
        ORDER BY partner_id ASC
        `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching partner services:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching partner services" });
  }
});

module.exports = router;
