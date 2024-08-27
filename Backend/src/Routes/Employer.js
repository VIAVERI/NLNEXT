const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const axios = require("axios");

// Create employee only email
router.post("/create_employe", async (req, res) => {
  try {
    const { email } = req.body;
    const newEmploye = await pool.query(
      "INSERT INTO employes (email) VALUES ($1) RETURNING *",
      [email]
    );

    axios.post("http://localhost:5000/api/send-invite", {
      to: email,
      name: "Employe",
    });

    res.json(newEmploye.rows[0]);
  } catch (error) {
    console.error("Error creating employe account:", error);
    res.status(500).json({
      error: "An error occurred while creating employe account",
      details: error.message,
    });
  }
});

module.exports = router;
