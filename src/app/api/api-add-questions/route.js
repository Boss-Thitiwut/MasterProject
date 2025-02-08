import { connectDB } from "../../../lib/mongodb";
import QuestionSet from "../../../models/QuestionDB";

export async function POST(req) {
    await connectDB();

    try {
        const { setId, question } = await req.json();
        console.log("Received setId:", setId); // Debugging
        console.log("Received question:", question); // Debugging

        if (!setId || !question) {
            return new Response(
                JSON.stringify({ success: false, error: "Set ID and question are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const questionSet = await QuestionSet.findById(setId);

        if (!questionSet) {
            return new Response(
                JSON.stringify({ success: false, error: "Question set not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        questionSet.questions.push(question); // Add the new question
        await questionSet.save();

        return new Response(
            JSON.stringify({ success: true, message: "Question added successfully", data: questionSet }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error adding question:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
