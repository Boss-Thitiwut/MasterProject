"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError("Both username and password are required.");
            return;
        }

        try {
            const response = await fetch("/api/api-auth-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Save role in localStorage
                localStorage.setItem("role", data.role);

                // Dispatch the roleChange event
                window.dispatchEvent(new Event("roleChange"));

                // Redirect user based on role
                if (data.role === "admin") {
                    router.push("/dashboard"); // Admin goes to Dashboard
                } else {
                    router.push("/questions"); // All other roles go to Questions
                }
            } else {
                setError(data.error || "Invalid credentials.");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="homepage-container">
            <div className="login-card">
                <h1 className="title">Login</h1>
                <p className="subtitle">Enter your credentials to login</p>

                <div className="input-container">
                    <div className="input-field">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Type your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Type your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>

                <div className="register-section">
                    <p>Or Sign Up Using</p>
                    <Link href="/register" className="register-link">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
