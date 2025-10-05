const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

// 👇 This must come *after* app is created and before listen()
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Mini-Okta Auth Service Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
