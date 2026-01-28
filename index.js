import express from "express";
import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Gmail SMTP transporter (Railway-safe)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Optional but smart: verify once at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP verify failed:", err.message);
  } else {
    console.log("✅ SMTP ready");
  }
});

// 🔁 Cron: every 1 minute
cron.schedule("* * * * *", async () => {
  console.log("⏱️ Cron tick:", new Date().toISOString());

  try {
    await transporter.sendMail({
      from: `"Railway Test" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: "⏱️ Railway Gmail Cron Test",
      text: "If you receive this, Gmail SMTP works on Railway.",
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Server running. Gmail cron active.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
