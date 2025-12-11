// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

// ---------- CORS (env-driven, strict in production) ----------
const FRONTEND_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;
console.log("FRONTEND_URL =", FRONTEND_URL || "(not set)");

// Allowed origins list (dev + production)
const allowedOrigins = new Set([
  "http://localhost:5173", // dev (Vite)
]);
if (FRONTEND_URL) allowedOrigins.add(FRONTEND_URL);

// origin function: decide what to return for Access-Control-Allow-Origin
function originCallback(origin, callback) {
  // allow requests with no origin (curl, mobile apps, server-to-server)
  if (!origin) return callback(null, true);

  // if not production (dev/test) allow localhost and echo origin if in allowed list
  if (process.env.NODE_ENV !== "production") {
    if (allowedOrigins.has(origin)) return callback(null, true);
    // also allow other origins in development to make testing easier:
    return callback(null, true);
  }

  // production: only allow if origin exactly matches allowedOrigins
  if (allowedOrigins.has(origin)) {
    // echo the origin back (CORS module will set the header to the request origin)
    return callback(null, true);
  }

  // otherwise block
  return callback(new Error("CORS policy: origin not allowed"), false);
}

app.use(
  cors({
    origin: originCallback,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Parse JSON bodies
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// ------------------- DATABASE CONNECTION -------------------
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ------------------- ROUTES IMPORT -------------------
const authRoutes = require("./routes/auth");
const notificationRoutes = require("./routes/notifications");
const animalRoutes = require("./routes/animals");

// ------------------- BASIC ROUTES -------------------
app.get("/", (req, res) => {
  res.send("API is running ✔");
});

// Health endpoint
app.get("/healthz", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ------------------- AUTH / API ROUTES -------------------
app.use("/api", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/animals", animalRoutes);

// ------------------- UPLOADS SETUP -------------------
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },
});

app.use("/uploads", express.static(UPLOAD_DIR));

// ------------------- UPLOAD ROUTE -------------------
app.post("/api/upload", upload.array("photos", 8), (req, res) => {
  try {
    const fileUrls = (req.files || []).map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
    }));
    return res.json({ ok: true, files: fileUrls });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

// ------------------- SERVER START -------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT} (PORT=${PORT})`);
});
