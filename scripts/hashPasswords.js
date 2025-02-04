import { connectDB } from "../../../lib/mongodb";
import Register from "../../../models/Register";

export async function POST(req) {
    await connectDB();

    try {
        const { username, password } = await req.json();

        // Find user in the database
        const user = await Register.findOne({ username });

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, error: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("🔍 User found:", user);

        // Compare plain text passwords
        if (password !== user.password) {
            console.log("🔴 Password mismatch:", {
                enteredPassword: password,
                storedPassword: user.password,
            });
            return new Response(
                JSON.stringify({ success: false, error: "Invalid Password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Successful login
        return new Response(
            JSON.stringify({ success: true, role: user.role || "user" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("❌ Server error:", error);
        return new Response(
            JSON.stringify({ success: false, error: "Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
