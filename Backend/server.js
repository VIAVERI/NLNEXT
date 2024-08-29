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
const partnerProfileRoutes = require("./src/Routes/PartnersProfile");
const partnerRoutes = require("./src/Routes/Partners");
const serviceRoutes = require("./src/Routes/Services");
const partnersAccRoutes = require("./src/Routes/partnersAccount");
const emailRoutes = require("./src/Routes/Email");
const employerRoutes = require("./src/Routes/Employer");
const favoritesRoutes = require("./src/Routes/Favorites");
const userRoutes = require("./src/Routes/Users");
const popularRoutes = require("./src/Routes/Popular"); // Add this linec
const searchRoutes = require("./src/Routes/Search");
const partnershipRequestRoutes = require("./src/Routes/PartnershipRequest");
const partnerServicesRoutes = require("./src/Routes/PartnerServices");

// Use routes
app.use("/api/articles", articleRoutes);
app.use("/api", emailRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/partners_acc", partnersAccRoutes);
app.use("/api/partners_acc", partnerProfileRoutes);
app.use("/api/submit-article", require("./src/Routes/SubmitArticle"));
app.use("/api/favorites", favoritesRoutes);
app.use("/api/popular", popularRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/partnership-request", partnershipRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/partner-services", partnerServicesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
