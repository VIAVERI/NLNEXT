const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const hbs = require("handlebars");
const fs = require("fs");
const path = require("path");

/// Update this line to use the correct path
const emailTemplate = fs.readFileSync(
  path.join(__dirname, "..", "views", "email.handlebars"),
  "utf8"
);
const compiledTemplate = hbs.compile(emailTemplate);

router.post("/send-email", async (req, res) => {
  const { to, name, password } = req.body;

  // Render the email HTML
  const htmlContent = compiledTemplate({
    name: name,
    email: to,
    password: password,
  });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dilsha99t@gmail.com",
      pass: "geat evme knpr iuqu",
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"NLNEXT" dilsha99t@gmail.com',
      to: to,
      subject: "Your New Partner Account",
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
