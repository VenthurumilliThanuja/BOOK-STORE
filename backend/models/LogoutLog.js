import mongoose from "mongoose";

const logoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" }
  },
  { timestamps: true, collection: "logout_logs" }
);

export default mongoose.model("LogoutLog", logoutLogSchema);
