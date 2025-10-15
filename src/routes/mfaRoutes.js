const express = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// 📍 1. Setup MFA – Generate QR Code
router.post("/setup", verifyToken, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `MiniOkta (${req.user.email})`,
    });
    await User.findByIdAndUpdate(req.user.id, { mfaSecret: secret.base32 });
    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.status(200).json({ message: "MFA setup QR generated", qrDataUrl });
  } catch (err) {
    res.status(500).json({ message: "Error generating MFA setup" });
  }
});

// 📍 2. Verify MFA Code during setup
router.post("/verify-setup", verifyToken, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: code,
    });
    if (!verified) return res.status(400).json({ message: "Invalid MFA code" });
    user.mfaEnabled = true;
    await user.save();
    res.status(200).json({ message: "MFA enabled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying MFA" });
  }
});

// 📍 3. Validate MFA during Login
router.post("/validate", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.mfaEnabled)
      return res.status(400).json({ message: "MFA not enabled for this user" });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: code,
    });
    if (!verified) return res.status(400).json({ message: "Invalid MFA code" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "MFA login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error verifying MFA" });
  }
});

module.exports = router;
