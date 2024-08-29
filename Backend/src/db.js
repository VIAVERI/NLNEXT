const { Pool } = require("pg");
require("dotenv").config();
const admin = require("firebase-admin");

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized:
      process.env.SSL_REJECT_UNAUTHORIZED === "false" ? false : true,
  },
});

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("PostgreSQL connected successfully");
  }
});

// // Initialize Firebase Admin SDK
// const serviceAccount = require("./config/nlnext-go-firebase-adminsdk-ntti0-2da10c4eb9.json");
// console.log("Starting Firebase Admin SDK initialization...");

// try {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
//   });

//   console.log("Firebase Admin SDK initialized successfully");

//   // Test Firestore connection
//   const db = admin.firestore();
//   console.log("Attempting to connect to Firestore...");

//   db.collection("users")
//     .limit(1)
//     .get()
//     .then(() => {
//       console.log("Firestore connection successful");
//     })
//     .catch((error) => {
//       console.error("Firestore connection failed:", error);
//       console.error("Firestore error details:", JSON.stringify(error, null, 2));
//     });
// } catch (error) {
//   console.error("Error during Firebase Admin SDK initialization:", error);
//   console.error("Error stack trace:", error.stack);
// }

module.exports = {
  pool,
  admin,
};
