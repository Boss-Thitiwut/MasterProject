"use client";
import { useState, useEffect } from "react";

export default function SurveyPage() {
    const [questionSets, setQuestionSets] = useState([]);
    const [newQuestionSet, setNewQuestionSet] = useState("");
    const [selectedSetId, setSelectedSetId] = useState("");
    const [newQuestion, setNewQuestion] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch Question Sets
    const fetchQuestionSets = async () => {
        try {
            const res = await fetch("/api/api-create-questions", { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setQuestionSets(data.data || []);
            } else {
                setErrorMessage("Error fetching question sets.");
            }
        } catch (error) {
            setErrorMessage("Error fetching question sets.");
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchQuestionSets();
    }, []);

    // Create Question Set
    const createQuestionSet = async () => {
        if (!newQuestionSet.trim()) {
            alert("Please enter a valid question set name.");
            return;
        }
        try {
            const res = await fetch("/api/api-create-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newQuestionSet.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                fetchQuestionSets();
                setNewQuestionSet("");
                alert("Question set created successfully.");
            } else {
                alert(data.error || "Failed to create question set.");
            }
        } catch (error) {
            console.error("Error creating question set:", error);
        }
    };

    // Delete Question Set
    const deleteQuestionSet = async (setId) => {
        if (!confirm("Are you sure you want to delete this question set?")) return;
        try {
            const res = await fetch("/api/api-delete-questions", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ setId }),
            });
            const data = await res.json();
            if (data.success) {
                fetchQuestionSets();
                alert("Question set deleted.");
            } else {
                alert(data.error || "Failed to delete question set.");
            }
        } catch (error) {
            console.error("Error deleting question set:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
            <div className="w-full max-w-4xl space-y-8 bg-white shadow-md rounded-lg p-10">

                {/* Create Question Set */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create a Question Set</h2>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={newQuestionSet}
                            onChange={(e) => setNewQuestionSet(e.target.value)}
                            placeholder="Enter question set name"
                            className="flex-grow p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={createQuestionSet}
                            className="bg-blue-600 text-white font-medium px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
                        >
                            Create
                        </button>
                    </div>
                </div>

                {/* Manage Question Sets */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Question Sets</h2>
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
                        <table className="w-full bg-white">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-4 px-6 text-left">Question Set Name</th>
                                    <th className="py-4 px-6 text-center w-36">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-md">
                                {questionSets.map((set, index) => (
                                    <tr key={set._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-4 px-6">{set.name}</td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => deleteQuestionSet(set._id)}
                                                className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Questions Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Questions to a Question Set</h2>
                    <select
                        onChange={(e) => setSelectedSetId(e.target.value)}
                        value={selectedSetId}
                        className="w-full p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 mb-4"
                    >
                        <option value="" disabled>Select a question set</option>
                        {questionSets.map((set) => (
                            <option key={set._id} value={set._id}>{set.name}</option>
                        ))}
                    </select>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter a question"
                            className="flex-grow p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            className="bg-green-600 text-white font-medium px-6 py-3 rounded-md text-lg hover:bg-green-700 transition"
                        >
                            Add Question
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
