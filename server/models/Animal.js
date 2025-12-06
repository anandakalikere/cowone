// models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    animalType: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, default: "" },

    photos: [{ type: String, required: true }], // URLs like "/uploads/xxxxx.jpg"

    sellerName: { type: String, default: "" },
    sellerPhone: { type: String, default: "" },
    sellerEmail: { type: String, default: "" },

    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animal", animalSchema);
