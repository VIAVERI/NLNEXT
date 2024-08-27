// const admin = require("firebase-admin");
// const express = require("express");
// const { pool } = require("../db");

// const authenticatePartner = async (req, res, next) => {
//   console.log("Entering authenticatePartner middleware");
//   try {
//     const authHeader = req.headers.authorization;
//     console.log("Authorization header:", authHeader);

//     if (!authHeader) {
//       console.log("No Authorization header provided");
//       return res
//         .status(401)
//         .json({ error: "No Authorization header provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       console.log("No token found in Authorization header");
//       return res.status(401).json({ error: "No token provided" });
//     }

//     console.log("Token extracted from header:", token);

//     console.log("Verifying token with Firebase Admin SDK...");
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     console.log("Decoded token:", decodedToken);

//     req.user = decodedToken;

//     console.log("Fetching user document from Firestore...");
//     try {
//       const userDoc = await admin
//         .firestore()
//         .collection("users")
//         .doc(decodedToken.uid)
//         .get();

//       if (!userDoc.exists) {
//         console.log("User not found in Firestore");
//         return res.status(404).json({ error: "User not found in Firestore" });
//       }

//       const userData = userDoc.data();
//       console.log("User data from Firestore:", userData);

//       if (!userData.partner_organization) {
//         console.log("User is not associated with a partner organization");
//         return res.status(403).json({
//           error: "User is not associated with a partner organization",
//         });
//       }

//       req.partnerOrganization = userData.partner_organization;
//       console.log("Partner organization set:", req.partnerOrganization);

//       console.log(
//         "Authentication successful, proceeding to next middleware/route handler"
//       );
//       next();
//     } catch (firestoreError) {
//       console.error("Firestore access error:", firestoreError);
//       return res.status(500).json({
//         error: "Error accessing user data",
//         details: firestoreError.message,
//       });
//     }
//   } catch (error) {
//     console.error("Authentication error:", error);
//     if (error.code === "auth/id-token-expired") {
//       return res
//         .status(401)
//         .json({ error: "Token expired. Please refresh your token." });
//     }
//     res
//       .status(401)
//       .json({ error: "Authentication failed", details: error.message });
//   }
// };
// module.exports = authenticatePartner;
