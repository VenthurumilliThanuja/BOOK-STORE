import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    books: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Paid" },
    orderStatus: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Placed"
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
