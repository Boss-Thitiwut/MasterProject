import { connectDB } from "@/lib/mongodb";
import QuestionSet from "@/models/QuestionDB";

export async function GET() {
    try {
        await connectDB();

        const questionSets = await QuestionSet.find();

        if (!questionSets || questionSets.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "No question sets found." }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ success: true, data: questionSets }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching question sets:", error);
        return new Response(JSON.stringify({ success: false, error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}


export async function POST(req) {
    try {
        await connectDB();

        const { name } = await req.json();
        if (!name) {
            return new Response(JSON.stringify({ success: false, error: "Name is required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const existingSet = await QuestionSet.findOne({ name: name.trim() });
        if (existingSet) {
            return new Response(JSON.stringify({ success: false, error: "Question set already exists." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const newQuestionSet = new QuestionSet({ name: name.trim(), questions: [] });
        await newQuestionSet.save();

        return new Response(JSON.stringify({ success: true, data: newQuestionSet }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error creating question set:", error);
        return new Response(JSON.stringify({ success: false, error: "Server error." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
