'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetching for demonstration
        const fetchResponses = async () => {
            setLoading(true);
            const mockData = [
                {
                    user: "User1",
                    answers: [5, 4, 3, 5, 2, 5, 4, 3, 5, 4],
                },
                {
                    user: "User2",
                    answers: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                },
            ];
            setResponses(mockData);
            setLoading(false);
        };

        fetchResponses();
    }, []);

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Page</h1>
            {loading ? (
                <p className="loading-text">Loading responses...</p>
            ) : responses.length > 0 ? (
                <div>
                    <h2 className="results-title">Questionnaire Results</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                {[...Array(10)].map((_, i) => (
                                    <th key={i}>Q{i + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((response, index) => (
                                <tr key={index}>
                                    <td className="user-cell">{response.user}</td>
                                    {response.answers.map((answer, i) => (
                                        <td key={i} className="answer-cell">{answer}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-text">No responses found.</p>
            )}

            <style jsx>{`
                .admin-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                .admin-title {
                    font-size: 2rem;
                    color: #007aff;
                    margin-bottom: 20px;
                }
                .results-title {
                    font-size: 1.5rem;
                    color: #333;
                    margin: 20px 0;
                }
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .results-table th,
                .results-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: center;
                }
                .results-table th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                    color: #333;
                }
                .user-cell {
                    font-weight: bold;
                }
                .answer-cell {
                    color: #007aff;
                }
                .loading-text,
                .no-data-text {
                    font-size: 1.2rem;
                    color: #555;
                }
            `}</style>
        </div>
    );
}
