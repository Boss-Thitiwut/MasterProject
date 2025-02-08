import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Role-based access
}, { timestamps: true });

export default mongoose.models.Register || mongoose.model("Register", RegisterSchema);


