const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Import routes
const articleRoutes = require("./src/Routes/Articles");
const partnerRoutes = require("./src/Routes/Partners");
const serviceRoutes = require("./src/Routes/Services"); // Add this line

// Use routes
app.use("/api/articles", articleRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});