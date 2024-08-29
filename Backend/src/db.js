const { Pool } = require("pg");
require("dotenv").config();
const admin = require("firebase-admin");

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

// Initialize Firebase Admin SDK
const serviceAccount = require("./config/nlnext-go-firebase-adminsdk-ntti0-2da10c4eb9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

module.exports = {
  pool,
  admin,
};
