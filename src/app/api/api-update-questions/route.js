import { connectDB } from "../../../lib/mongodb";
import { QuestionSet } from "../../../models"; // Use named import for QuestionSet

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { setId, questionIndex } = params; // Get parameters from the request
        const { question } = await req.json(); // Parse the request body

        // Validate input
        if (!question) {
            return new Response(
                JSON.stringify({ success: false, error: "Question is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find the question set by its ID
        const questionSet = await QuestionSet.findById(setId);

        // Check if the question set and the specific question exist
        if (!questionSet || !questionSet.questions[questionIndex]) {
            return new Response(
                JSON.stringify({ success: false, error: "Question or question set not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update the specific question
        questionSet.questions[questionIndex] = question;
        await questionSet.save();

        return new Response(
            JSON.stringify({ success: true, message: "Question updated", data: questionSet }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error updating question:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
