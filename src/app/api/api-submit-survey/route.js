// pages/api/api-submit-survey/route.js (or wherever your API is)
import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";

export async function POST(req) {
  try {
    await connectDB();

    const { questionSetId, user, role, answers, emotionScore, emotionLabel } = await req.json();

if (
  !questionSetId ||
  !user ||
  !role ||
  !Array.isArray(answers) ||
  typeof emotionScore !== "number"
) {
  return new Response(
    JSON.stringify({ success: false, error: "Missing or invalid fields." }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

const responseDoc = new SurveyResponse({
  questionSetId,
  user,
  role,
  answers,
  emotionScore,
  emotionLabel, // optional
});


    await responseDoc.save();

    return new Response(
      JSON.stringify({ success: true, message: "Survey submitted successfully." }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting survey:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
