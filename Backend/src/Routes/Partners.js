const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM PARTNERs_ACCOUNT ORDER BY partner_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching partners" });
  }
});

module.exports = router;
