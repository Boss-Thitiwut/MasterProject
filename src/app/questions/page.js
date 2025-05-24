"use client";

import { useState, useEffect } from "react";
import Select from "react-select"; // ✅ เพิ่ม
import styles from "./questionPage.module.css";
import * as XLSX from "xlsx";

export default function SurveyPage() {
  const [questionSets, setQuestionSets] = useState([]);
  const [newQuestionSet, setNewQuestionSet] = useState("");
  const [selectedSetId, setSelectedSetId] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [excelQuestions, setExcelQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const roleOptions = [
    { value: "Product Owner", label: "เจ้าของผลิตภัณฑ์ (Product Owner)" },
    { value: "Requirements Engineer", label: "วิศวกรรมความต้องการ (Requirements Engineer)" },
    { value: "Architectural Designer", label: "นักออกแบบสถาปัตยกรรม (Architectural Designer)" },
    { value: "Backend Developer", label: "นักพัฒนาส่วนหลังระบบ (Backend Developer)" },
    { value: "Frontend Developer", label: "นักพัฒนาส่วนหน้าระบบ (Frontend Developer)" },
    { value: "DevOps", label: "วิศวกรรมการพัฒนาระบบและปฏิบัติการ (DevOps)" },
    { value: "Quality Engineer", label: "วิศวกรรมคุณภาพ (Quality Engineer)" },
  ];

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  const fetchQuestionSets = async () => {
    try {
      const res = await fetch("/api/api-create-questions", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setQuestionSets(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const createQuestionSet = async () => {
    if (!newQuestionSet.trim()) return alert("Enter a name.");
    try {
      const res = await fetch("/api/api-create-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newQuestionSet.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewQuestionSet("");
        fetchQuestionSets();
        alert("Set created.");
      } else {
        alert(data.error || "Create failed.");
      }
    } catch (err) {
      console.error("Create Error:", err);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedSetId || selectedRoles.length === 0) {
      alert("Please select both a question set and at least one role.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const questions = rows.map((row) => row[0]).filter(Boolean);
      setExcelQuestions(questions);
      setMessage(`Loaded ${questions.length} questions. Ready to upload.`);
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  const handleConfirmUpload = async () => {
    if (!excelQuestions.length || !selectedSetId || selectedRoles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (const question of excelQuestions) {
      try {
        const res = await fetch("/api/api-add-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            setId: selectedSetId,
            question: question.trim(),
            roles: selectedRoles,
          }),
        });
        const result = await res.json();
        if (result.success) successCount++;
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    if (successCount === excelQuestions.length) {
      setMessage(`✅ All ${successCount} questions uploaded successfully.`);
    } else {
      setMessage(`⚠️ Uploaded ${successCount} of ${excelQuestions.length}.`);
    }

    setExcelQuestions([]);
    setSelectedSetId("");
    setSelectedRoles([]);
    await fetchQuestionSets();
    setTimeout(() => setMessage(""), 3000);
    setIsUploading(false);
  };

  const deleteQuestionSet = async (setId) => {
    if (!confirm("Delete this set?")) return;
    try {
      const res = await fetch("/api/api-delete-questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchQuestionSets();
        alert("Deleted.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Manage Survey Questions</h1>

        <div className={styles.section}>
          <h2>Create a Question Set</h2>
          <div className={styles.row}>
            <input
              className={styles.input}
              placeholder="Enter a new set name"
              value={newQuestionSet}
              onChange={(e) => setNewQuestionSet(e.target.value)}
            />
            <button className={styles.primaryButton} onClick={createQuestionSet}>
              Create
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Add Questions via Excel</h2>
          <div className={styles.row}>
            <select
              className={styles.input}
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
            >
              <option value="">Select a question set</option>
              {questionSets.map((set) => (
                <option key={set._id} value={set._id}>
                  {set.name}
                </option>
              ))}
            </select>

            <div className={styles.input} style={{ minWidth: "250px" }}>
              <Select
                isMulti
                options={roleOptions}
                placeholder="Select Roles..."
                value={roleOptions.filter((opt) => selectedRoles.includes(opt.value))}
                onChange={(selected) => setSelectedRoles(selected.map((s) => s.value))}
              />
            </div>

            <label className={styles.uploadButton}>
              Upload Excel File
              <input type="file" accept=".xlsx" onChange={handleExcelUpload} hidden />
            </label>
          </div>

          {excelQuestions.length > 0 && (
            <div className={styles.previewBlock}>
              <h3>Preview Questions</h3>
              <ul className={styles.previewList}>
                {excelQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
              <button className={styles.secondaryButton} onClick={handleConfirmUpload}>
                Confirm Upload
              </button>
              {isUploading && (
                <p style={{ textAlign: "center", marginTop: "1rem", color: "#4b5563" }}>
                  ⏳ Uploading... Please wait.
                </p>
              )}
            </div>
          )}

          {message && <p className={styles.message}>{message}</p>}
        </div>

        <div className={styles.section}>
          <h2>Manage Question Sets</h2>
          <div className={styles.setList}>
            {questionSets.map((set) => (
              <div className={styles.setItem} key={set._id}>
                <span>{set.name}</span>
                <button className={styles.deleteButton} onClick={() => deleteQuestionSet(set._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
