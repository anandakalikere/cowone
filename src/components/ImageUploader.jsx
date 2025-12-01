// src/components/ImageUploader.jsx
import React, { useState } from "react";
import { api } from "../api";

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const form = new FormData();
    files.forEach((f) => form.append("photos", f));

    setUploading(true);
    try {
      const res = await api.uploadImages(form);
      if (!res.ok) {
        alert(res.message || "Upload failed");
        return;
      }
      // server returns { ok: true, uploaded: [...] } in previous server code
      const images = res.uploaded || res.images || [];
      // call callback with saved image docs
      if (onUpload) onUpload(images);
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload error, check console.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      {uploading && <div>Uploading…</div>}
    </div>
  );
}
