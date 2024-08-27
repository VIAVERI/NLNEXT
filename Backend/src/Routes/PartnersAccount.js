const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM PARTNERs_ACCOUNT ORDER BY partner_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching partners" });
  }
});

router.post(
  "/create_partner",
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const { name, email, external_system_id, login_credentials, notes } =
        req.body;
      let profile_image_url = req.file ? `/uploads/${req.file.filename}` : null;

      const newPartner = await pool.query(
        "INSERT INTO PARTNERs_ACCOUNT (name, email, external_system_id, login_credentials, notes, profile_image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          name,
          email,
          external_system_id,
          login_credentials,
          notes,
          profile_image_url,
        ]
      );

      await axios.post("http://localhost:5000/api/send-email", {
        to: email,
        name: name,
        password: login_credentials,
      });

      res.json(newPartner.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while creating partner account",
        details: error.message,
      });
    }
  }
);

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPartner = await pool.query(
      "UPDATE PARTNERs_ACCOUNT SET account_status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (updatedPartner.rows.length === 0) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(updatedPartner.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating partner status" });
  }
});

module.exports = router;
