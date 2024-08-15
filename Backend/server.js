const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Import routes
const articleRoutes = require("./src/Routes/Articles");
const partnerRoutes = require("./src/Routes/Partners");

// Use routes
app.use("/api/articles", articleRoutes);
app.use("/api/partners", partnerRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});