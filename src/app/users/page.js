"use client";

import { useEffect, useState } from "react";
import styles from "../questions/questionPage.module.css";

export default function UserSurveyPage() {
  const [questionSets, setQuestionSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [emotionScore, setEmotionScore] = useState(null);
  const [message, setMessage] = useState("");

  const emotionLabels = [
    "มีความสุขกับงาน",
    "พอใจแต่เริ่มเหนื่อย",
    "เฉย ๆ ไม่มีแรงบันดาลใจ",
    "เริ่มรู้สึกไม่อยากทำงาน",
    "เครียดและหมดไฟ",
    "อยากลาออก / ไม่เห็นอนาคต"
  ];

  useEffect(() => {
    const fetchSets = async () => {
      const userRole = localStorage.getItem("role");
      const res = await fetch("/api/api-create-questions");
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        // Filter question sets based on role match
        const matchingSets = data.data.filter((set) =>
        set.questions.some((q) => Array.isArray(q.role) ? q.role.includes(userRole) : q.role === userRole)
        );

        if (matchingSets.length === 0) {
          setMessage("⚠️ ไม่มีชุดคำถามที่ตรงกับบทบาทของคุณ");
          return;
        }

        setQuestionSets(matchingSets);
         // ✅ เพิ่ม filter เฉพาะคำถามของ role นั้น ๆ
        const filteredQuestions = matchingSets[0].questions.filter((q) =>
        Array.isArray(q.role) ? q.role.includes(userRole) : q.role === userRole
        );
        setQuestions(matchingSets[0].questions || []);
      } else {
        setMessage("❌ ไม่พบชุดคำถาม");
      }
    };

    fetchSets();
  }, []);

  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const questionSetId = questionSets[currentSetIndex]?._id;
    const emotionLabel = emotionLabels[emotionScore - 1];

    const formattedAnswers = Object.entries(answers).map(([index, score]) => ({
      questionIndex: Number(index),
      score: Number(score),
    }));

    if (!user || !role || !questionSetId || formattedAnswers.length === 0 || !emotionScore) {
      return alert("⚠️ Please ensure all questions and emotion are answered.");
    }

    const response = await fetch("/api/api-submit-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionSetId,
        user,
        role,
        answers: formattedAnswers,
        emotionScore,
        emotionLabel
      }),
    });

    const data = await response.json();

    if (data.success) {
      if (currentSetIndex + 1 < questionSets.length) {
        const nextIndex = currentSetIndex + 1;
        setCurrentSetIndex(nextIndex);
        setQuestions(questionSets[nextIndex].questions || []);
        setAnswers({});
        setEmotionScore(null);
      } else {
        setSubmitted(true);
      }
    } else {
      alert(data.error || "Submission failed.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {message && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
          {message}
        </p>
      )}

      <div className={styles.card}>
        <h1 className={styles.title}>
          📝 Survey: {questionSets[currentSetIndex]?.name || "Loading..."}
        </h1>

        {!submitted ? (
          <form
            className={styles.section}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {questions.length === 0 ? (
              <p>Loading questions...</p>
            ) : (
              <>
                {questions.map((q, idx) => (
                  <div key={idx} className={styles.section}>
                    <label className={styles.inputLabel}>
                      {idx + 1}. {q.text || q}
                    </label>
                    <div className={styles.scaleGroup}>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <label key={val} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            value={val}
                            checked={answers[idx] === String(val)}
                            onChange={(e) => handleChange(idx, e.target.value)}
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className={styles.section}>
                  <p className={styles.inputLabel}>
                    จากการทำงานใน Agile Process ของ Sprint ที่ผ่านมา คุณมาความรู้สึกอย่างไร?
                  </p>
                  <div className={styles.emotionScale}>
                    {[
                      { emoji: "😀", label: "มีความสุขกับงาน" },
                      { emoji: "🙂", label: "พอใจแต่เริ่มเหนื่อย" },
                      { emoji: "😐", label: "เฉย ๆ ไม่มีแรงบันดาลใจ" },
                      { emoji: "😟", label: "เริ่มรู้สึกไม่อยากทำงาน" },
                      { emoji: "😠", label: "เครียดและหมดไฟ" },
                      { emoji: "😡", label: "อยากลาออก / ไม่เห็นอนาคต" },
                    ].map((item, index) => (
                      <label
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          margin: "0 10px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          color: "#333",
                        }}
                      >
                        <input
                          type="radio"
                          name="emotion"
                          value={index + 1}
                          checked={emotionScore === index + 1}
                          onChange={() => setEmotionScore(index + 1)}
                          style={{ display: "none" }}
                        />
                        <div style={{ fontSize: "2rem" }}>{item.emoji}</div>
                        <div
                          style={{
                            marginTop: "5px",
                            textAlign: "center",
                            color: "#333",
                          }}
                        >
                          {item.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.primaryButton}>
                  {currentSetIndex + 1 === questionSets.length
                    ? "Submit All"
                    : "Next Topic"}
                </button>
              </>
            )}
          </form>
        ) : (
          <div className={styles.section}>
            <h2>✅ Thank you for completing all topics!</h2>
          </div>
        )}
      </div>
    </div>
  );
}
