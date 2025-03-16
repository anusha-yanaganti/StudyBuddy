import React from "react";
import Sidebar from "./Sidebar";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    
    <div className="home-wrapper">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="home-container">
        <h2>Welcome to your future</h2>
        <p>Access your program and study plan</p>

        <div className="card">
          <div className="item">
            <span>Study Plan - "Create & Track Your Study Plan"</span>
            <button onClick={() => navigate("/timetable")}>Start</button>
          </div>

          <div className="item">
            <span>Pomodoro Timer - "Boost Focus with Pomodoro"</span>
            <button onClick={() => navigate("/pomodoro")}>Start</button>
          </div>

          <div className="item">
            <span>Progress Tracker - "Track Your Performance with Insights"</span>
            <button onClick={() => navigate("/progress")}>Start</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
