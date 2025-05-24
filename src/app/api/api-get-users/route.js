import { connectDB } from "@/lib/mongodb";
import SurveyResponse from "@/models/SurveyResponse";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // Optional

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await SurveyResponse.find(query)
      .distinct("user");

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No users found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: users }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
