import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./ProgressTracker.css"; // Add styles for a better look
import Sidebar from "./Sidebar";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracker = () => {
  // 🔹 Mock progress data (randomized for different users)
  const generateRandomProgress = () => ({
    dailyProgress: Math.floor(Math.random() * 101), // 0 - 100%
    weeklyProgress: Math.floor(Math.random() * 101),
    monthlyProgress: Math.floor(Math.random() * 101),
  });

  const [progress, setProgress] = useState(generateRandomProgress());

  // 🔹 Mock task data with random completion percentages
  const generateRandomTasks = () => {
    const taskPrefixes = ["Read", "Complete", "Revise", "Watch", "Practice"];
    const taskSubjects = ["Math", "Science", "Algorithms", "DBMS", "React", "Networking", "AI", "Python"];
    
    return Array.from({ length: Math.floor(Math.random() * 4) + 3 }, () => ({
      name: `${taskPrefixes[Math.floor(Math.random() * taskPrefixes.length)]} ${taskSubjects[Math.floor(Math.random() * taskSubjects.length)]}`,
      completionPercentage: Math.floor(Math.random() * 100),
    }));
  };
  

  const [tasks, setTasks] = useState(generateRandomTasks());

  useEffect(() => {
    // Refresh progress data every time the component reloads
    setProgress(generateRandomProgress());
    setTasks(generateRandomTasks());
  }, []);

  // 🔹 Generate pie chart data dynamically
  const pieData = {
    labels: tasks.map((task) => task.name),
    datasets: [
      {
        data: tasks.map((task) => task.completionPercentage),
        backgroundColor: ["#E67E22", "#F4D03F", "#2ECC71", "#5D6D7E", "#3498DB", "#9B59B6"],
      },
    ],
  };

  return (
    <div className="home-wrapper">
      {/* Sidebar */}
      <Sidebar />
    <div className="progress-container">
      <h2>📊 Study Progress Tracker</h2>

      {/* 📌 Progress Bars Section */}
      <div className="progress-bars">
        {["daily", "weekly", "monthly"].map((type) => (
          <div key={type} className="progress-box">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)} Goals</span>
            <div className="progress-bar">
              <div
                className={`progress-fill ${type}`}
                style={{ width: `${progress[`${type}Progress`]}%` }}
              ></div>
            </div>
            <span className="progress-percent">{progress[`${type}Progress`]}%</span>
          </div>
        ))}
      </div>

      {/* 📌 Pie Chart Section */}
      <div className="pie-chart-container">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: tasks.length > 0 },
            },
          }}
        />
      </div>
    </div>
    </div>
  );
};

export default ProgressTracker;
