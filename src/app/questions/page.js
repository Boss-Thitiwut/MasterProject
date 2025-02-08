'use client';

import { useState, useEffect } from 'react';

export default function SurveyPage() {
    const [questionSets, setQuestionSets] = useState([]);
    const [newQuestionSet, setNewQuestionSet] = useState('');
    const [selectedSetId, setSelectedSetId] = useState('');
    const [newQuestion, setNewQuestion] = useState('');

    const fetchQuestionSets = async () => {
        try {
            const res = await fetch('/api/api-create-questions');
            const data = await res.json();
            if (data.success) {
                setQuestionSets(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching question sets:', error);
        }
    };

    useEffect(() => {
        fetchQuestionSets();
    }, []);

    const createQuestionSet = async () => {
        if (!newQuestionSet.trim()) {
            alert('Please enter a valid question set name.');
            return;
        }
        try {
            const res = await fetch('/api/api-create-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newQuestionSet.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setQuestionSets((prev) => [...prev, data.data]);
                setNewQuestionSet('');
                alert('The question set has been created successfully..');
            }
        } catch (error) {
            console.error('Error creating question set:', error);
        }
    };

    const addQuestion = async () => {
        if (!newQuestion.trim() || !selectedSetId) {
            alert('Please select a question set and enter a valid question.');
            return;
        }
        try {
            const res = await fetch('/api/api-add-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ setId: selectedSetId, question: newQuestion.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setQuestionSets((prev) =>
                    prev.map((set) =>
                        set._id === selectedSetId
                            ? { ...set, questions: [...set.questions, newQuestion] }
                            : set
                    )
                );
                setNewQuestion('');
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    return (
        <div className="homepage-container">
            <div className="grid grid-cols-2 gap-8 p-8">
                <div className="card p-6 shadow-lg rounded-lg bg-white">
                    <h1 className="text-xl font-bold mb-4 text-center">Create a Question Set</h1>
                    <input
                        type="text"
                        value={newQuestionSet}
                        onChange={(e) => setNewQuestionSet(e.target.value)}
                        placeholder="Enter question set name"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <button
                        onClick={createQuestionSet}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Create Question Set
                    </button>
                </div>

                <div className="card p-6 shadow-lg rounded-lg bg-white">
                    <h1 className="text-xl font-bold mb-4 text-center">Add Questions to a Question Set</h1>
                    <select
                        onChange={(e) => setSelectedSetId(e.target.value)}
                        value={selectedSetId}
                        className="w-full p-2 border rounded mb-4"
                    >
                        <option value="" disabled>
                            Select a question set
                        </option>
                        {questionSets.map((set) => (
                            <option key={set._id} value={set._id}>
                                {set.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter a question"
                        className="w-full p-2 border rounded mb-4"
                    />
                    <button
                        onClick={addQuestion}
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                    >
                        Add Question
                    </button>
                </div>
            </div>
        </div>
    );
}
