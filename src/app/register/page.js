"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../questions/questionPage.module.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  

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
    <div className={styles.wrapper}>
      <div className={styles.card} style={{ maxWidth: "460px", width: "100%", margin: "0 auto" }}>
      <button className={styles.secondaryButton} style={{ marginBottom: "1rem" }} onClick={() => router.push("/")}>
          ← Back
        </button>

        <h1 className={styles.title} style={{ textAlign: "center" }}>Register</h1>

       
        <form onSubmit={handleRegister}>
          <div className={styles.section}>
            <label className={styles.inputLabel} htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={30}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.inputLabel} htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              maxLength={30}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.inputLabel} htmlFor="role">Role</label>
            <select
              className={styles.input}
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

          {errorMessage && <p className={styles.message}>{errorMessage}</p>}

          <button type="submit" className={styles.primaryButton} style={{ width: "100%" }}>Register</button>
        </form>

        {showSuccessMessage && (
          <div className={styles.section} style={{ textAlign: "center" }}>
            <h2>✅ Registration Successful!</h2>
            <button className={styles.secondaryButton} onClick={() => setShowSuccessMessage(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
