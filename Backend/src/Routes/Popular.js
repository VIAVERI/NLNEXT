const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        article_id, 
        title, 
        content, 
        category, 
        status, 
        author, 
        published_at, 
        image_url,
        rating,
        CASE 
          WHEN image_data IS NOT NULL THEN 
            encode(image_data, 'base64')
          ELSE 
            NULL 
        END AS image_data
      FROM ARTICLE 
      WHERE rating>=4
      ORDER BY article_id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching articles" });
  }
});

module.exports = router;
