"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleUserTypeChange = (type) => {
        setIsAdmin(type === "admin");
        setError("");
    };

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
                    router.push("/dashboard");
                } else if (data.role === "user") {
                    router.push("/questions");
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
                <p className="subtitle">Select your role and login to continue</p>
                <div className="user-type-toggle">
                    <button
                        className={`toggle-button ${!isAdmin ? "active" : ""}`}
                        onClick={() => handleUserTypeChange("user")}
                    >
                        User Login
                    </button>
                    <button
                        className={`toggle-button ${isAdmin ? "active" : ""}`}
                        onClick={() => handleUserTypeChange("admin")}
                    >
                        Admin Login
                    </button>
                </div>

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
                    {isAdmin ? "Login as Admin" : "Login as User"}
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
