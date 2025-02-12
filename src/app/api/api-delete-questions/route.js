import { connectDB } from "../../../lib/mongodb";
import QuestionSet from "../../../models/QuestionDB"; // Ensure correct import

export async function DELETE(req) {
    await connectDB();

    try {
        const { setId } = await req.json(); // We only need setId to delete the set

        if (!setId) {
            return new Response(
                JSON.stringify({ success: false, error: "Set ID is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const deletedSet = await QuestionSet.findByIdAndDelete(setId);

        if (!deletedSet) {
            return new Response(
                JSON.stringify({ success: false, error: "Question set not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Question set deleted", data: deletedSet }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error deleting question set:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
