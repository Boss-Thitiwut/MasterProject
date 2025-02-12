import { connectDB } from "@/lib/mongodb";
import QuestionSet from "@/models/QuestionDB";

export async function POST(req) {
    try {
        await connectDB();

        const { setId, question } = await req.json();

        if (!setId || !question) {
            return new Response(JSON.stringify({ success: false, error: "Missing setId or question." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const questionSet = await QuestionSet.findById(setId);
        if (!questionSet) {
            return new Response(JSON.stringify({ success: false, error: "Question set not found." }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        questionSet.questions.push(question);
        await questionSet.save();

        return new Response(JSON.stringify({ success: true, data: questionSet }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error adding question:", error);
        return new Response(JSON.stringify({ success: false, error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
