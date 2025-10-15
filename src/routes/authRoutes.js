const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();
console.log("✅ authRoutes file loaded");

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ------------------- REGISTER -------------------
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashed, name, provider: "local" });

    const token = generateToken(user);
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    console.log("🔍 User fetched from DB:", user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Log before MFA check
    console.log("🔒 MFA Enabled?", user.mfaEnabled);

    if (user.mfaEnabled) {
      console.log("🛑 MFA is enabled — stopping before issuing token");
      return res.status(200).json({
        message: "MFA required",
        mfaRequired: true
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login success, issuing token");

    res.json({ message: "Login success", token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ------------------- GOOGLE AUTH -------------------
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      console.log("✅ Google OAuth successful:", user.email);

      // Fetch user again from DB to check MFA flag
      const dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        console.error("❌ User not found after Google OAuth");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("🔒 MFA Enabled?", dbUser.mfaEnabled);

      // 🔹 If MFA is enabled, do NOT send token yet — require MFA code validation
      if (dbUser.mfaEnabled) {
  console.log("🛑 MFA is enabled — returning JSON instead of redirect");
  return res.status(200).json({
    message: "MFA required",
    mfaRequired: true,
    email: dbUser.email
  });
}

      // 🔹 Otherwise issue JWT directly
      const token = jwt.sign(
        { id: dbUser._id, email: dbUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("✅ Issued token for Google user:", dbUser.email);

      res.status(200).json({
        message: "Google login success",
        token,
        user: {
          name: dbUser.name,
          email: dbUser.email,
          provider: dbUser.provider
        }
      });
    } catch (err) {
      console.error("❌ Google callback error:", err);
      res.status(500).json({ message: "OAuth failed" });
    }
  }
);

// ------------------- VERIFY TOKEN MIDDLEWARE -------------------
const verifyToken = (req, res, next) => {
  console.log("🔹 verifyToken middleware hit");
  console.log("🔸 Headers received:", req.headers);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("❌ No Authorization header found");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Invalid token:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  });
};

router.get("/debug-headers", (req, res) => {
  console.log("🧠 Debug route hit. Headers received:", req.headers);
  res.json(req.headers);
});


// ------------------- PROFILE ROUTE -------------------
router.get("/profile", verifyToken, async (req, res) => {
  console.log("✅ Profile route hit");
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("✅ User found:", user.email);
    res.json({ message: "Profile fetched", user });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
