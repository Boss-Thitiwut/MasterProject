import mongoose from "mongoose";

const QuestionSetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    questions: [
      {
        text: { type: String, required: true },
         role: [{ type: String, required: true }] // ✅ รับ array ของ string
      }
    ]
  },
  { timestamps: true }
);

const QuestionSet =
  mongoose.models.QuestionSet || mongoose.model("QuestionSet", QuestionSetSchema);

export default QuestionSet;
