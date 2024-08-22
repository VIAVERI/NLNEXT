const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new user with profile image upload
router.post(
  "/create_user",
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const { name, email, partner_organization, status, notes, password } =
        req.body;
      let profile_image_url = null;

      if (req.file) {
        profile_image_url = `/uploads/${req.file.filename}`;
      }

      // Ensure that password is not null or empty
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const newUser = await pool.query(
        "INSERT INTO users (name, email, partner_organization, status, notes, password, profile_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          name,
          email,
          partner_organization,
          status || "Pending",
          notes,
          password,
          profile_image_url,
        ]
      );
      res.json(newUser.rows[0]);
    } catch (error) {
      console.error("Error creating user account:", error);
      res.status(500).json({
        error: "An error occurred while creating user account",
        details: error.message,
      });
    }
  }
);

//get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

module.exports = router;
