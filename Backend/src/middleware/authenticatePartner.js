const admin = require("firebase-admin");
const express = require("express");
const pool = require("../db");

const authenticatePartner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    const partnerDoc = await admin
      .firestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!partnerDoc.exists || !partnerDoc.data().partner_organization) {
      return res.status(403).json({ message: "Not authorized as partner" });
    }

    req.partnerOrganization = partnerDoc.data().partner_organization;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};

module.exports = authenticatePartner;
