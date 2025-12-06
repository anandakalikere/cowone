// server/routes/notifications.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const User = require("../models/User"); // you already have this in auth routes

const router = express.Router();

// simple auth middleware (same JWT secret as auth routes)
async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "No token" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ ok: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error (notifications):", err);
    res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

// GET /api/notifications/me  → all notifications for logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ ok: true, notifications });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/notifications  → create notification for current user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, message } = req.body;
    if (!message) {
      return res.status(400).json({ ok: false, message: "Message is required" });
    }

    const notif = await Notification.create({
      user: req.user._id,
      type: type || "info",
      message,
    });

    res.status(201).json({ ok: true, notification: notif });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/notifications/mark-all-read  → mark all as read
router.post("/mark-all-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
