import { connectDB } from "../../../lib/mongodb";
import QuestionSet from "../../../models/QuestionDB";

export async function POST(req) {
    await connectDB();

    try {
        const { name } = await req.json();

        if (!name) {
            return new Response(
                JSON.stringify({ success: false, error: "Name is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const newQuestionSet = new QuestionSet({ name: name.trim(), questions: [] });
        await newQuestionSet.save();

        return new Response(
            JSON.stringify({ success: true, message: "Question set created", data: newQuestionSet }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error creating question set:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
