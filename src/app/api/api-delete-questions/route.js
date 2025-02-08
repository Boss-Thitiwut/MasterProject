import { connectDB } from "../../../lib/mongodb";
import { QuestionSet } from "../../../models";

export async function DELETE(req) {
    await connectDB();

    try {
        const { setId, questionIndex } = await req.json();

        if (!setId || questionIndex === undefined) {
            return new Response(
                JSON.stringify({ success: false, error: "Set ID and question index are required" }),
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

        questionSet.questions.splice(questionIndex, 1);
        await questionSet.save();

        return new Response(
            JSON.stringify({ success: true, message: "Question deleted", data: questionSet }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error deleting question:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
