export default function handler(req, res) {
    if (req.method === "GET") {
        // Mock response for role validation
        res.status(200).json({ role: "non-user" }); // Replace with actual logic
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}