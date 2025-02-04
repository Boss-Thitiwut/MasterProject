'use client';
import { useState, useEffect } from 'react';

export default function QuestionsConfigPage() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');

    // Mock initial fetch
    useEffect(() => {
        // Simulating fetching questions from an API
        const fetchQuestions = async () => {
            const mockQuestions = [
                'What is your level of satisfaction with your job?',
                'How do you feel about the support provided by your manager?',
                'Are you satisfied with the training opportunities available?',
            ];
            setQuestions(mockQuestions);
        };

        fetchQuestions();
    }, []);

    // Add a new question
    const handleAddQuestion = () => {
        if (newQuestion.trim() === '') return alert('Question cannot be empty!');
        setQuestions([...questions, newQuestion]);
        setNewQuestion('');
    };

    // Delete a question
    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    // Start editing a question
    const handleEditQuestion = (index) => {
        setEditIndex(index);
        setEditedQuestion(questions[index]);
    };

    // Save the edited question
    const handleSaveEdit = () => {
        if (editedQuestion.trim() === '') return alert('Question cannot be empty!');
        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = editedQuestion;
        setQuestions(updatedQuestions);
        setEditIndex(null);
        setEditedQuestion('');
    };

    return (
        <div className="config-container">
            <h1 className="config-title">Configure Questions</h1>

            {/* Add New Question Section */}
            <div className="add-question">
                <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter new question"
                    className="question-input"
                />
                <button onClick={handleAddQuestion} className="add-button">Add Question</button>
            </div>

            {/* Questions List */}
            <ul className="questions-list">
                {questions.map((question, index) => (
                    <li key={index} className="question-item">
                        {editIndex === index ? (
                            <div className="edit-section">
                                <input
                                    type="text"
                                    value={editedQuestion}
                                    onChange={(e) => setEditedQuestion(e.target.value)}
                                    className="question-input"
                                />
                                <button onClick={handleSaveEdit} className="save-button">Save</button>
                                <button onClick={() => setEditIndex(null)} className="cancel-button">Cancel</button>
                            </div>
                        ) : (
                            <div className="question-display">
                                <span>{question}</span>
                                <div className="action-buttons">
                                    <button onClick={() => handleEditQuestion(index)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDeleteQuestion(index)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Styles */}
            <style jsx>{`
                .config-container {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                }
                .config-title {
                    font-size: 2rem;
                    color: #007aff;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .add-question {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .question-input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .add-button,
                .edit-button,
                .delete-button,
                .save-button,
                .cancel-button {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                    background-color: #007aff;
                    transition: background-color 0.3s ease;
                }
                .delete-button {
                    background-color: #ff4d4d;
                }
                .save-button {
                    background-color: #4caf50;
                }
                .cancel-button {
                    background-color: #777;
                }
                .add-button:hover {
                    background-color: #005bb5;
                }
                .delete-button:hover {
                    background-color: #ff1a1a;
                }
                .save-button:hover {
                    background-color: #388e3c;
                }
                .cancel-button:hover {
                    background-color: #555;
                }
                .questions-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .question-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-bottom: 10px;
                }
                .question-display {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    align-items: center;
                }
                .action-buttons {
                    display: flex;
                    gap: 10px;
                }
                .edit-section {
                    display: flex;
                    gap: 10px;
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
