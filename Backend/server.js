const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const articleRoutes = require("./src/Routes/Articles");
const partnerRoutes = require("./src/Routes/Partners");

// Use routes
app.use("/api/articles", articleRoutes);
app.use("/api/partners_acc", partnerRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
