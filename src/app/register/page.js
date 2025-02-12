"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // New state for role
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const roles = [
        { value: "Product Owner", label: "เจ้าของผลิตภัณฑ์ (Product Owner)" },
        { value: "Requirements Engineer", label: "วิศวกรรมความต้องการ (Requirements Engineer)" },
        { value: "Architectural Designer", label: "นักออกแบบสถาปัตยกรรม (Architectural Designer)" },
        { value: "Backend Developer", label: "นักพัฒนาส่วนหลังระบบ (Backend Developer)" },
        { value: "Frontend Developer", label: "นักพัฒนาส่วนหน้าระบบ (Frontend Developer)" },
        { value: "DevOps", label: "วิศวกรรมการพัฒนาระบบและปฏิบัติการ (DevOps)" },
        { value: "Quality Engineer", label: "วิศวกรรมคุณภาพ (Quality Engineer)" },
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !role) {
            setErrorMessage("All fields are required.");
            setShowSuccessMessage(false);
            return;
        }

        try {
            const response = await fetch("/api/api-auth-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccessMessage(true);
                setErrorMessage("");
                setUsername("");
                setPassword("");
                setRole("");
            } else {
                setErrorMessage(data.error || "Something went wrong.");
                setShowSuccessMessage(false);
            }
        } catch (error) {
            setErrorMessage("Server error. Please try again later.");
            setShowSuccessMessage(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select a Role</option>
                            {roles.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <button type="submit" className="register-button">Register</button>
                </form>
                {showSuccessMessage && (
                    <div className="success-popup">
                        <p>Registration Successful!</p>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="close-popup"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .register-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, #007aff, #4c8eff, #80bfff);
                    font-family: Arial, sans-serif;
                }
                .register-card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    width: 400px;
                }
                .form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: bold;
                    display: block;
                    color: #555;
                }
                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                }
                .register-button {
                    background-color: #007aff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
