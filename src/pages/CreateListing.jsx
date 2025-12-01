// src/pages/CreateListing.jsx
import React, { useState } from "react";
import { api } from "../api";
import ImageUploader from "../components/ImageUploader";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [breed, setBreed] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]); // array of url strings

  function handleImages(uploadedList) {
    // uploadedList: array of image docs from server (image.url or image.filename)
    const urls = uploadedList.map((i) => i.url || `/uploads/${i.filename}` || i.filename);
    setPhotos(prev => [...prev, ...urls]);
  }

  async function create() {
    const payload = { title, breed, price: Number(price), location, description, photos };
    const res = await api.createListing(payload);
    if (!res.ok) {
      alert(res.message || "Create listing failed");
      return;
    }
    alert("Listing created");
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>List Your Animal</h2>

      <ImageUploader onUpload={handleImages} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {photos.map((p, i) => <img key={i} src={`http://localhost:4000${p}`} alt="" width={120} />)}
      </div>

      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Breed" value={breed} onChange={e=>setBreed(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
      <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}
