import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";
import QuestionSet from "@/models/QuestionDB";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");

    if (!username) {
      return new Response(JSON.stringify({ success: false, error: "Username required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const surveys = await SurveyResponse.find({ user: username });

    const result = await Promise.all(
      surveys.map(async (survey) => {
        const qSet = await QuestionSet.findById(survey.questionSetId);
        return {
          questionSetId: survey.questionSetId,
          name: qSet?.name || "Unknown Set",
          submittedAt: survey.submittedAt,
          emotionScore: survey.emotionScore
        };
      })
    );

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ success: false, error: "Server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
