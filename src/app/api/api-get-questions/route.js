import { connectDB } from "@/lib/mongodb";
import QuestionSet from "@/models/QuestionDB";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const setId = searchParams.get("setId");

    // ✅ Validate ID before querying
    if (!setId || !mongoose.Types.ObjectId.isValid(setId)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or missing setId." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const questionSet = await QuestionSet.findById(setId);

    if (!questionSet) {
      return new Response(
        JSON.stringify({ success: false, error: "Question set not found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: questionSet }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
