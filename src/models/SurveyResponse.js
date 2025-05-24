import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  questionSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionSet",
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      score: Number,
    },
  ],
  user: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  emotionScore: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  emotionLabel: {
    type: String,
    required: false
  }
  
   
});

export default mongoose.models.SurveyResponse ||
  mongoose.model("SurveyResponse", responseSchema);
