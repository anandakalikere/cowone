// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ---------- CORS (FIXED & SAFE) ----------
const FRONTEND_URL = process.env.FRONTEND_URL?.trim();
console.log("FRONTEND_URL =", FRONTEND_URL || "(not set)");

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Postman, curl

  // allow localhost
  if (origin.startsWith("http://localhost")) return true;

  // allow main vercel domain
  if (FRONTEND_URL && origin === FRONTEND_URL) return true;

  // allow ALL vercel preview URLs
  if (origin.endsWith(".vercel.app")) return true;

  return false;
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    return res
      .status(403)
      .json({ ok: false, message: "CORS: origin not allowed" });
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------- BODY PARSER ----------
app.use(express.json());

// ---------- LOGGER ----------
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ---------- ROUTES ----------
const authRoutes = require("./routes/auth");
const notificationRoutes = require("./routes/notifications");
const animalRoutes = require("./routes/animals");

app.get("/", (req, res) => res.send("API is running ✔"));
app.get("/healthz", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.use("/api", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/animals", animalRoutes);

// ---------- UPLOADS ----------
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

app.use("/uploads", express.static(UPLOAD_DIR));

app.post("/api/upload", upload.array("photos", 8), (req, res) => {
  const files = (req.files || []).map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
  }));
  res.json({ ok: true, files });
});

// ---------- START ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
