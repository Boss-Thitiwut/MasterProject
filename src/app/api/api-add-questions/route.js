// src/app/api/api-add-questions/route.js
import { connectDB } from "@/lib/mongodb";
import QuestionSet from "@/models/QuestionDB";

export async function POST(req) {
  await connectDB();

  try {
    // 🪵 Read and parse the body safely
    const bodyText = await req.text();
    console.log("🔍 RAW BODY:", bodyText);

    let json;
    try {
      json = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON:", parseError);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { setId, question, roles } = json;

    // ✅ Validate fields
    if (
      !setId || typeof setId !== "string" ||
      !question || typeof question !== "string" || question.trim() === "" ||
      !Array.isArray(roles) || roles.length === 0
    ) {
      console.warn("❌ Validation failed:", { setId, question, roles });
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Find question set
    const questionSet = await QuestionSet.findById(setId);
    if (!questionSet) {
      return new Response(
        JSON.stringify({ success: false, error: "Question set not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Push questions for all roles

    questionSet.questions.push({
      text: question.trim(),
      role: roles.map((r) => r.trim())  // array of strings
    });

    await questionSet.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Question added for ${roles.length} role(s).`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
