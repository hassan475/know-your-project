import React, { useState } from "react";
import { IProduct, IMediaFile } from "../types";

const AddProductForm: React.FC = () => {
  const [productID, setProductID] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [weight, setWeight] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [notes, setNotes] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<IMediaFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: IMediaFile[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productID", productID);
    formData.append("description", description);
    formData.append("weight", String(weight));
    formData.append("price", String(price));
    formData.append("notes", notes);

    mediaFiles.forEach((media) => {
      formData.append("files", media.file);
    });

    try {
      const response = await fetch("https://localhost:5001/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product saved successfully!");
        setProductID("");
        setDescription("");
        setWeight("");
        setPrice("");
        setNotes("");
        setMediaFiles([]);
      } else {
        const err = await response.text();
        alert("Failed to save product: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Error while submitting product.");
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-4">
      <h2 className="text-xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product ID"
          value={productID}
          onChange={(e) => setProductID(e.target.value)}
          required
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-3 gap-2 mt-2">
          {mediaFiles.map((media, idx) => (
            <img
              key={idx}
              src={media.preview}
              alt="preview"
              className="w-full h-24 object-cover border"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
