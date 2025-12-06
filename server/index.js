// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

// ⭐ CORS – allow frontend (change origin if you deploy somewhere else)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Parse JSON bodies
app.use(express.json());

// ⭐ Log every request (helps debugging)
app.use((req, res, next) => {
  console.log(req.method, req.url);
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
const animalRoutes = require("./routes/animals"); // ⭐ now enabled


// ------------------- BASIC ROUTE -------------------
app.get("/", (req, res) => {
  res.send("API is running ✔");
});


// ------------------- AUTH ROUTES -------------------
app.use("/api", authRoutes);


// ------------------- NOTIFICATION ROUTES -------------------
app.use("/api/notifications", notificationRoutes);


// ------------------- ANIMAL ROUTES (listings CRUD) -------------------
app.use("/api/animals", animalRoutes); // ⭐ /api/animals GET / POST / DELETE


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
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    // allow images and videos (because frontend uploads both)
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },
});

// Serve uploaded files
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
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
