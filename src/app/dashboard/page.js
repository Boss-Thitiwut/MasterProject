"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation";

// Register the required chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function DashboardPage() {
    const [role, setRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (!storedRole || (storedRole !== "admin" && storedRole !== "user")) {
            router.push("/"); // Redirect non-authorized users to the home page
        } else {
            setRole(storedRole); // Set the valid role
        }
    }, [router]);

    const categories = [
        {
            title: "Employees Perception of Support",
            data: [4.7, 3.8, 4.5, 4.0, 3.7],
            labels: ["Social Support", "Supervisory Support", "Training", "Empowerment"],
        },
        {
            title: "Employees Perception of Commitment",
            data: [4.7, 3.9, 4.4, 4.0],
            labels: ["Rewards/Recognition", "Job Security", "Organizational Justice"],
        },
        {
            title: "Employees Perception of Complexity",
            data: [4.8, 4.0, 3.5, 4.2],
            labels: ["Job Stress", "Locus of Control", "Role Ambiguity"],
        },
    ];

    const userCategories = [
        {
            title: "User-Specific Data",
            data: [3.5, 3.8, 4.0],
            labels: ["Metric A", "Metric B", "Metric C"],
        },
    ];

    if (!role) {
        return null; // Avoid rendering until the role is determined
    }

    const renderCharts = () => {
        const dataToDisplay = role === "admin" ? categories : userCategories;

        return dataToDisplay.map((category, index) => (
            <div key={index} className="chart-card">
                <h2>{category.title}</h2>
                <Bar
                    data={{
                        labels: category.labels,
                        datasets: [
                            {
                                label: "Average Rating",
                                data: category.data,
                                backgroundColor: "#007aff",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: { display: false },
                        },
                        scales: {
                            y: { beginAtZero: true, max: 5 },
                        },
                    }}
                />
            </div>
        ));
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">{role === "admin" ? "Admin Dashboard" : "User Dashboard"}</h1>
            <div className="charts-container">{renderCharts()}</div>

            <style jsx>{`
                .dashboard-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .dashboard-title {
                    font-size: 2rem;
                    color: #007aff;
                    margin-bottom: 20px;
                }
                .charts-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }
                .chart-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                }
                .chart-card h2 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                    color: #007aff;
                }
                .chart-card canvas {
                    max-height: 300px;
                }
            `}</style>
        </div>
    );
}
