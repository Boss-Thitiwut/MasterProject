import mongoose from "mongoose";

const QuestionSetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        questions: [{ type: String }],
    },
    { timestamps: true }
);

const QuestionSet =
    mongoose.models.QuestionSet || mongoose.model("QuestionSet", QuestionSetSchema);

export default QuestionSet;
