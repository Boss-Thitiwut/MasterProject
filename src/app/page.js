"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import styles from "./page.module.css";

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
        const role = data.role;

        localStorage.setItem("role", role);
        localStorage.setItem("username", username); // ✅ save username from input field
        
        window.dispatchEvent(new Event("roleChange"));

        // Redirect based on role
        let redirectPath = "/";
        if (role === "admin") {
          redirectPath = "/dashboard";
        } else if (
          [
            "Product Owner",
            "Requirements Engineer",
            "Architectural Designer",
            "Backend Developer",
            "Frontend Developer",
            "DevOps",
            "Quality Engineer",
          ].includes(role)
        ) {
          redirectPath = "/users";
        }

        router.push(redirectPath);
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Access your account below</p>

        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <div className={styles.inputWrapper}>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <FaUser />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputWrapper}>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FaLock />
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>

        <div className={styles.footer}>
          <p>Don't have an account?</p>
          <Link href="/register" className={styles.link}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
