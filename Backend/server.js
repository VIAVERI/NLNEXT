const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: "nlnext-go",
  host: "localhost",
  database: "nlnext-go",
  password: "23gqPd4hP3&fAG3mkp6BD&$C4CfMyTdE",
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
