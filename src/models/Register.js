import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: [
            "Product Owner",
            "Requirements Engineer",
            "Architectural Designer",
            "Backend Developer",
            "Frontend Developer",
            "DevOps",
            "Quality Engineer",
        ],
        required: true
    },
}, { timestamps: true });

export default mongoose.models.Register || mongoose.model("Register", RegisterSchema);
