// server/routes/animals.js
const express = require("express");
const Animal = require("../models/Animal");

const router = express.Router();

/**
 * GET /api/animals
 * Return all animals (latest first)
 */
router.get("/", async (req, res) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 });
    res.json({ ok: true, animals });
  } catch (err) {
    console.error("GET /api/animals error:", err);
    res.status(500).json({ ok: false, message: "Failed to load animals" });
  }
});

/**
 * POST /api/animals
 * Create a new animal listing
 */
router.post("/", async (req, res) => {
  try {
    // body comes from frontend SellView
    const {
      title,
      animalType,
      breed,
      age,
      price,
      location,
      description,
      photos,
      sellerName,
      sellerPhone,
      sellerEmail,
    } = req.body;

    if (!title || !animalType || !breed || !age || !price || !location || !photos || !photos.length) {
      return res
        .status(400)
        .json({ ok: false, message: "Missing required fields or photos" });
    }

    const animal = new Animal({
      title,
      animalType,
      breed,
      age,
      price,
      location,
      description,
      photos,
      sellerName,
      sellerPhone,
      sellerEmail,
      verified: false,
    });

    await animal.save();

    res.json({ ok: true, animal });
  } catch (err) {
    console.error("POST /api/animals error:", err);
    res.status(500).json({ ok: false, message: "Failed to create animal" });
  }
});

/**
 * DELETE /api/animals/:id
 * Delete a listing (mark as sold)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await Animal.findByIdAndDelete(id);

    if (!animal) {
      return res.status(404).json({ ok: false, message: "Animal not found" });
    }

    res.json({ ok: true, message: "Animal deleted" });
  } catch (err) {
    console.error("DELETE /api/animals/:id error:", err);
    res.status(500).json({ ok: false, message: "Failed to delete animal" });
  }
});

module.exports = router;
