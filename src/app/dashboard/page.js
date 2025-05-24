"use client";

import { useState, useEffect } from "react";
import styles from "./dashboardPage.module.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [surveyList, setSurveyList] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [activeSetId, setActiveSetId] = useState(null);
  const [currentEmotionLabel, setCurrentEmotionLabel] = useState("");
  const [roleCronbachAlpha, setRoleCronbachAlpha] = useState(null);
  const [kmoValue, setKmoValue] = useState(null);
  const [explainedVariance, setExplainedVariance] = useState([]);
  const [factorLoading, setFactorLoading] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(role = "") {
    const query = role ? `?role=${encodeURIComponent(role)}` : "";
    const res = await fetch(`/api/api-get-users${query}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
      setFilteredUsers(data.data);
    }
  }

  function handleSearchChange(e) {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value);
  }

  function handleRoleChange(e) {
    const role = e.target.value;
    setSelectedRole(role);
    fetchUsers(role);
  }

  function applyFilters(search) {
    let filtered = [...users];
    if (search) {
      filtered = filtered.filter((u) => u.toLowerCase().includes(search));
    }
    setFilteredUsers(filtered);
  }

  async function handleUserClick(username) {
    setSelectedUser(username);
    setSelectedSurvey(null);
    setSurveyList([]);
    setErrorMessage("");
    setActiveUser(username);
    setActiveSetId(null);
    setCurrentEmotionLabel("");
    setRoleCronbachAlpha(null);
    setKmoValue(null);
    setExplainedVariance([]);
    setFactorLoading([]);

    try {
      const res = await fetch(`/api/api-get-user-survey-list?user=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.success) {
        setSurveyList(data.data);
      } else {
        setErrorMessage("⚠️ This user has not completed any surveys.");
      }
    } catch {
      setErrorMessage("⚠️ Error fetching survey list.");
    }
  }

  async function handleSurveyClick(setId) {
    setSelectedSurvey(null);
    setErrorMessage("");
    setActiveSetId(setId);
    setRoleCronbachAlpha(null);
    setKmoValue(null);
    setExplainedVariance([]);
    setFactorLoading([]);

    try {
      const res = await fetch(`/api/api-get-user-survey?user=${encodeURIComponent(selectedUser)}&setId=${setId}`);
      const data = await res.json();

      if (data.success) {
        setSelectedSurvey(data.data);
        setCurrentEmotionLabel(data.data.emotionLabel || "Not provided");

        const role = data.data.role;

        const [cronRes, statRes] = await Promise.all([
          fetch(`/api/api-get-cronbach-by-role?role=${encodeURIComponent(role)}&setId=${setId}`),
          fetch(`/api/api-get-statistics?role=${encodeURIComponent(role)}&setId=${setId}`)
        ]);

        const cronData = await cronRes.json();
        const statData = await statRes.json();

        if (cronData.success) {
          setRoleCronbachAlpha(cronData.cronbachAlpha);
        }

        if (statData.success) {
          setKmoValue(statData.kmo ?? null);
          setExplainedVariance(statData.explainedVariance ?? []);
          setFactorLoading(statData.factorLoading ?? []);
        } else {
          console.warn("⚠️ statData.success is false");
        }
      } else {
        setErrorMessage("⚠️ Survey data not found.");
      }
    } catch (err) {
      console.error("❌ API call failed:", err);
    }
  }

  const activeHighlight = "#e0e7ff";

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.section}>
          <label className={styles.inputLabel}>Search User Name:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.input}
            placeholder="Enter user name..."
          />
        </div>

        <div className={styles.section}>
          <label className={styles.inputLabel}>Filter by Role:</label>
          <select value={selectedRole} onChange={handleRoleChange} className={styles.input}>
            <option value="">All Roles</option>
            <option value="Product Owner">Product Owner</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="DevOps">DevOps</option>
            <option value="Quality Engineer">Quality Engineer</option>
            <option value="Requirements Engineer">Requirements Engineer</option>
            <option value="Architectural Designer">Architectural Designer</option>
          </select>
        </div>

        <div className={styles.section}>
          <h2 className={styles.inputLabel}>Users:</h2>
          <div className={styles.previewList}>
            {filteredUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {filteredUsers.map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleUserClick(user)}
                    style={{
                      cursor: "pointer",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      background: user === activeUser ? activeHighlight : "transparent",
                      fontWeight: user === activeUser ? "600" : "normal",
                      color: "#1f2937",
                    }}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {surveyList.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.inputLabel}>{selectedUser}'s Surveys:</h2>
            <ul className={styles.previewList}>
              {surveyList.map((survey, index) => (
                <li
                  key={index}
                  onClick={() => handleSurveyClick(survey.questionSetId)}
                  style={{
                    cursor: "pointer",
                    padding: "0.4rem",
                    borderRadius: "8px",
                    background: survey.questionSetId === activeSetId ? activeHighlight : "transparent",
                  }}
                >
                  <strong>{survey.name}</strong> (submitted: {new Date(survey.submittedAt).toLocaleDateString()},
                  emotion: {survey.emotionLabel || survey.emotionScore})
                </li>
              ))}
            </ul>
          </div>
        )}

        {errorMessage && <div className={styles.message}>{errorMessage}</div>}

        {selectedSurvey && (
          <>
            <div className={styles.section}>
              <h2 className={styles.inputLabel}>🧠 Emotion: {currentEmotionLabel || "Not provided"}</h2>
              <ul className={styles.previewList}>
                {selectedSurvey.answers.map((ans, index) => (
                  <li key={index}>
                    <strong>Q:</strong> {ans.question}<br />
                    <strong>Score:</strong> {ans.score}
                    <hr style={{ margin: "0.5rem 0" }} />
                  </li>
                ))}
              </ul>
            </div>

            {roleCronbachAlpha !== null && (
              <div className={styles.section}>
                <h2 className={styles.inputLabel}>
                  🖋️ Cronbach’s Alpha:
                  <span style={{
                    marginLeft: "0.5rem",
                    fontWeight: 600,
                    color: roleCronbachAlpha >= 0.7 ? "green" : "red"
                  }}>
                    {roleCronbachAlpha} {roleCronbachAlpha >= 0.7 ? "✅" : "❌"}
                  </span>
                </h2>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.inputLabel}>📊 KMO:</h2>
              <p>
                {kmoValue !== null ? (
                  <span><strong>{kmoValue}</strong> {kmoValue >= 0.6 ? "✅ Acceptable" : "❌ Too Low"}</span>
                ) : (
                  "Cannot calculate (matrix is singular)"
                )}
              </p>
            </div>

          {Array.isArray(explainedVariance) && explainedVariance.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.inputLabel}>📈 Explained Variance (%):</h2>

                {(() => {
                  const total = explainedVariance.reduce((a, b) => a + b, 0);
                  const avg = total / explainedVariance.length;
                  let cumulative = 0;

                  return (
                    <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc", padding: "4px", color: "black" }}>Component</th>
                      <th style={{ border: "1px solid #ccc", padding: "4px", color: "black" }}>Variance (%)</th>
                      <th style={{ border: "1px solid #ccc", padding: "4px", color: "black" }}>Cumulative (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explainedVariance.map((val, idx) => {
                      cumulative += val;
                      const isHigh = val >= avg;
                      return (
                        <tr key={idx} style={{ background: isHigh ? "#fef9c3" : "transparent" }}>
                          <td style={{ border: "1px solid #ccc", padding: "4px", textAlign: "center", color: "black" }}>
                            {idx + 1}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "4px", textAlign: "center", color: "black" }}>
                            {val.toFixed(2)}%
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "4px", textAlign: "center", color: "black" }}>
                            {cumulative.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>


                      {/* Bar Chart for Explained Variance */}
                      <div style={{ marginTop: "2rem" }}>
                        <Bar
                          data={{
                            labels: explainedVariance.map((_, i) => `Component ${i + 1}`),
                            datasets: [
                              {
                                label: "Explained Variance (%)",
                                data: explainedVariance.map((v) => v.toFixed(2)),
                                backgroundColor: explainedVariance.map((v) =>
                                  v >= avg ? "#facc15" : "#93c5fd"
                                ),
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: {
                                  display: true,
                                  text: "Variance (%)",
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

           {Array.isArray(factorLoading) && factorLoading.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.inputLabel}>🔍 Factor Loadings</h2>
                <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc", padding: "4px", color: "black" }}>Question</th>
                      {factorLoading[0].map((_, colIdx) => (
                        <th key={colIdx} style={{ border: "1px solid #ccc", padding: "4px", color: "black" }}>
                          F{colIdx + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {factorLoading.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td style={{ border: "1px solid #ccc", padding: "4px", color: "black", fontWeight: 600 }}>
                          Q{rowIdx + 1}
                        </td>
                        {row.map((val, colIdx) => (
                          <td
                            key={colIdx}
                            style={{
                              border: "1px solid #ccc",
                              padding: "4px",
                              textAlign: "center",
                              color: "black",
                              background: val >= 0.3 ? "#fef9c3" : "transparent",
                            }}
                          >
                            {typeof val === "number" ? val.toFixed(3) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


            <div className={styles.section}>
              <h2 className={styles.inputLabel}>Answer Chart:</h2>
              <Bar
                data={{
                  labels: selectedSurvey.answers.map((a, i) => `Q${i + 1}`),
                  datasets: [
                    {
                      label: "Score",
                      data: selectedSurvey.answers.map((a) => a.score),
                      backgroundColor: "#6366f1",
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      min: 1,
                      max: 5,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
