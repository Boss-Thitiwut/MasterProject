import { connectDB } from "../../../lib/mongodb";
import Register from "../../../models/Register";

export async function POST(req) {
    await connectDB();

    try {
        const { username, password, role = "user" } = await req.json();

        // Check if the user already exists
        const existingUser = await Register.findOne({ username });
        if (existingUser) {
            return new Response(
                JSON.stringify({ success: false, error: "User already exists" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create the new user without encrypting the password
        const newUser = new Register({
            username,
            password, // Storing the password as plain text (not secure)
            role,
        });
        await newUser.save();

        return new Response(
            JSON.stringify({ success: true, message: "User registered successfully" }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: "Server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
