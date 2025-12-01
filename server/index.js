// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/auth");

// connect MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// use routes
app.use("/api", authRoutes);

// upload directory
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpg|jpeg|png|gif|webp)/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  }
});

// serve uploaded images
app.use("/uploads", express.static(UPLOAD_DIR));

// upload route
app.post("/api/upload", upload.array("photos", 8), (req, res) => {
  try {
    const fileUrls = req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      ok: true,
      files: fileUrls
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
