const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ARTICLE ORDER BY article_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching articles" });
  }
});

// Get a single article
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM ARTICLE WHERE article_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching article:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the article" });
  }
});

module.exports = router;
