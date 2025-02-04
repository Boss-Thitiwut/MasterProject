"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Both Username and Password are required.");
            setShowSuccessMessage(false);
            return;
        }

        try {
            const response = await fetch("/api/api-auth-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccessMessage(true);
                setErrorMessage("");
                setUsername("");
                setPassword("");
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
                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #333;
                }
                .form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }
                .form-group label {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: block;
                    color: #555;
                }
                .form-group input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                }
                .error {
                    color: red;
                    font-size: 12px;
                    margin-top: 10px;
                }
                .register-button {
                    background-color: #007aff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    width: 100%;
                    transition: background-color 0.3s;
                }
                .register-button:hover {
                    background-color: #005bb5;
                }
                .success-popup {
                    background: #d4edda;
                    color: #155724;
                    padding: 15px;
                    border: 1px solid #c3e6cb;
                    border-radius: 5px;
                    margin-top: 20px;
                    position: relative;
                    display: inline-block;
                }
                .close-popup {
                    background: transparent;
                    border: none;
                    color: #155724;
                    font-weight: bold;
                    margin-top: 10px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
