import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";
import QuestionSet from "@/models/QuestionDB";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("user");

    if (!username) {
      return new Response(
        JSON.stringify({ success: false, error: "Username is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 1: Find survey
    const survey = await SurveyResponse.findOne({ user: username });
    if (!survey) {
      return new Response(
        JSON.stringify({ success: false, error: "Survey not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get question set
    const questionSet = await QuestionSet.findById(survey.questionSetId);
    if (!questionSet) {
      return new Response(
        JSON.stringify({ success: false, error: "Question set not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 3: Map answers to question text
    const enrichedAnswers = survey.answers.map(answer => {
      const question = questionSet.questions[answer.questionIndex];
      return {
        question: question?.text || "Unknown question",
        role: question?.role || "Unknown",
        score: answer.score,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: survey.user,
          role: survey.role,
          emotionScore: survey.emotionScore,
          emotionLabel: survey.emotionLabel,
          submittedAt: survey.submittedAt,
          questionSetId: survey.questionSetId,               // ✅ เพิ่ม
          name: questionSet.name,                            // ✅ เพิ่ม
          answers: enrichedAnswers,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api-get-user-survey:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
