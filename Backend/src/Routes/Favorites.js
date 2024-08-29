const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Add an article to favorites
router.post("/", async (req, res) => {
  try {
    const { partnerId, articleId } = req.body;
    const result = await pool.query(
      "INSERT INTO favorite_articles (partner_id, article_id) VALUES ($1, $2) RETURNING *",
      [partnerId, articleId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ error: "An error occurred while adding the favorite", details: error.message });
  }
});

router.delete("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const { partnerId } = req.body;
    const result = await pool.query(
      "DELETE FROM favorite_articles WHERE partner_id = $1 AND article_id = $2 RETURNING *",
      [partnerId, articleId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res
      .status(500)
      .json({ error: "An error occurred while removing the favorite" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { partnerId } = req.query;
    const result = await pool.query(
      "SELECT a.* FROM article a JOIN favorite_articles fa ON a.article_id = fa.article_id WHERE fa.partner_id = $1",
      [partnerId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching favorites" });
  }
});

module.exports = router;
