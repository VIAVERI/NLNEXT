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
const serviceRoutes = require("./src/Routes/Services");
const partnersAccRoutes = require("./src/Routes/partnersAccount");
const emailRoutes = require("./src/Routes/Email");

// Use routes
app.use("/api/articles", articleRoutes);
app.use("/api", emailRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/partners_acc", partnersAccRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
