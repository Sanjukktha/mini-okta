const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// 🧩 CORS FIX
app.use(cors({ origin: "*", exposedHeaders: ["Authorization"] }));

// Parse JSON
app.use(express.json());

// 🧩 Log EVERYTHING coming in
app.use((req, res, next) => {
  console.log("📩 Incoming:", req.method, req.url);
  console.log("🔸 Headers:", req.headers);
  next();
});

// Session before passport
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: true
}));

// Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
const mfaRoutes = require("./routes/mfaRoutes");
app.use("/api/auth/mfa", mfaRoutes);


// DB
connectDB();

// Health Check
app.get("/", (req, res) => res.send("Mini-Okta Auth Service Running 🚀"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
