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

// // Update an article
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, category, status } = req.body;
//     const result = await pool.query(
//       "UPDATE ARTICLE SET title = $1, content = $2, category = $3, status = $4 WHERE article_id = $5 RETURNING *",
//       [title, content, category, status, id]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error updating article:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the article" });
//   }
// });

// Update an article
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;

    // Build the query dynamically based on what fields are provided
    let updateFields = [];
    let queryParams = [];
    let queryCounter = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${queryCounter}`);
      queryParams.push(title);
      queryCounter++;
    }
    if (content !== undefined) {
      updateFields.push(`content = $${queryCounter}`);
      queryParams.push(content);
      queryCounter++;
    }
    if (category !== undefined) {
      updateFields.push(`category = $${queryCounter}`);
      queryParams.push(category);
      queryCounter++;
    }
    if (status !== undefined) {
      updateFields.push(`status = $${queryCounter}`);
      queryParams.push(status);
      queryCounter++;
    }

    // If no fields to update, return early
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const queryString = `UPDATE ARTICLE SET ${updateFields.join(
      ", "
    )} WHERE article_id = $${queryCounter} RETURNING *`;
    queryParams.push(id);

    const result = await pool.query(queryString, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating article:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the article" });
  }
});

module.exports = router;
