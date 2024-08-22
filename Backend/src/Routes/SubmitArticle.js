const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const upload = multer();

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, author } = req.body;
        const status = "pending";
        const created_at = new Date();
        const updated_at = created_at;

        let imageData = null;
        if (req.file) {
            imageData = req.file.buffer;
        }

        const result = await pool.query(
            "INSERT INTO ARTICLE (title, content, category, author, image_data, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [title, content, category, author, imageData, status, created_at, updated_at]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error submitting article:", error);
        res.status(500).json({ error: "An error occurred while submitting the article" });
    }
});

module.exports = router;