import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    popularity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", genre: "text" });

export default mongoose.model("Book", bookSchema);
