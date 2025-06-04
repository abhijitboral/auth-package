const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendOtpEmail } = require("../utils/email");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hash });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60000);
  await user.update({ otp, otpExpiresAt: expiresAt });
  await sendOtpEmail(email, otp);
  res.json({ message: "OTP sent to email" });
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp || new Date() > user.otpExpiresAt)
    return res.status(400).json({ error: "Invalid or expired OTP" });
  const hash = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hash, otp: null, otpExpiresAt: null });
  res.json({ message: "Password reset successful" });
});

module.exports = router;