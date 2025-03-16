import { useState, useEffect } from "react";
import alarmSound from "../assets/alarm.mp3"; // Add alarm file
import Sidebar from "./Sidebar";

const PomodoroTimer = () => {
    // Load user-defined settings from local storage or use defaults
    const getStoredTime = (key, defaultValue) => {
      const stored = localStorage.getItem(key);
      return stored ? parseInt(stored, 10) : defaultValue;
    };
  
    // Default values
    const [pomodoroTime, setPomodoroTime] = useState(getStoredTime("pomodoroTime", 25 * 60));
    const [shortBreakTime, setShortBreakTime] = useState(getStoredTime("shortBreakTime", 5 * 60));
    const [longBreakTime, setLongBreakTime] = useState(getStoredTime("longBreakTime", 15 * 60));
  
    const [timeLeft, setTimeLeft] = useState(pomodoroTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentMode, setCurrentMode] = useState("pomodoro"); // "pomodoro" | "shortBreak" | "longBreak"
  
    const alarm = new Audio(alarmSound);
  // Timer logic
useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } 
  
    // Play alarm when 10 seconds are left
    if (timeLeft === 10) {
      alarm.play();
    }
  
    // When timer reaches 0, stop it and switch mode
    if (timeLeft === 0) {
      setIsRunning(false);
      setIsPaused(false);
      if (currentMode === "pomodoro") {
        setCurrentMode("shortBreak");
        setTimeLeft(shortBreakTime);
      } else {
        setCurrentMode("pomodoro");
        setTimeLeft(pomodoroTime);
      }
    }
  
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentMode, pomodoroTime, shortBreakTime]);
  
  
    // Convert seconds to MM:SS format
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
  
    // Update user-defined default values
    const updateDefaultTimes = () => {
      localStorage.setItem("pomodoroTime", pomodoroTime);
      localStorage.setItem("shortBreakTime", shortBreakTime);
      localStorage.setItem("longBreakTime", longBreakTime);
      alert("Default times updated!");
    };
  
    return (
        <div className="home-wrapper">
      {/* Sidebar */}
      <Sidebar />
      <div style={styles.container}>
        <h1>Pomodoro Timer</h1>
  
        {/* Custom Time Inputs */}
        <div style={styles.settings}>
          <label>Pomodoro (min):</label>
          <input type="number" value={pomodoroTime / 60} onChange={(e) => setPomodoroTime(e.target.value * 60)} />
          
          <label>Short Break (min):</label>
          <input type="number" value={shortBreakTime / 60} onChange={(e) => setShortBreakTime(e.target.value * 60)} />
          
          <label>Long Break (min):</label>
          <input type="number" value={longBreakTime / 60} onChange={(e) => setLongBreakTime(e.target.value * 60)} />
          
          <button style={styles.saveButton} onClick={updateDefaultTimes}>Save Defaults</button>
        </div>
  
        {/* Mode Selection */}
        <div style={styles.modeButtons}>
          <button onClick={() => { setCurrentMode("pomodoro"); setTimeLeft(pomodoroTime); setIsRunning(false); }} style={styles.button}>
            Pomodoro
          </button>
          <button onClick={() => { setCurrentMode("shortBreak"); setTimeLeft(shortBreakTime); setIsRunning(false); }} style={styles.button}>
            Short Break
          </button>
          <button onClick={() => { setCurrentMode("longBreak"); setTimeLeft(longBreakTime); setIsRunning(false); }} style={styles.button}>
            Long Break
          </button>
        </div>
  
        {/* Timer Display */}
        <div style={styles.timer}>{formatTime(timeLeft)}</div>
  
        {/* Controls */}
        <div style={styles.controls}>
          {!isRunning && !isPaused && (
            <button style={styles.startButton} onClick={() => setIsRunning(true)}>Start</button>
          )}
          {isRunning && (
            <button style={styles.pauseButton} onClick={() => { setIsRunning(false); setIsPaused(true); }}>Pause</button>
          )}
          {isPaused && (
            <button style={styles.resumeButton} onClick={() => { setIsRunning(true); setIsPaused(false); }}>Resume</button>
          )}
          <button style={styles.stopButton} onClick={() => { setIsRunning(false); setIsPaused(false); setTimeLeft(pomodoroTime); }}>Stop</button>
          <button style={styles.restartButton} onClick={() => window.location.reload()}>Restart</button>
        </div>
      </div>
      </div>
    );
  };
  
  // Styles
  const styles = {
    container: {
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        backgroundColor: "#1c1c1c",
        padding: "10px 30px", // Reduced top padding
        borderRadius: "10px",
        width: "500px",
        margin: "50px 475px",
      },      
    settings: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    modeButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    timer: {
      fontSize: "3rem",
      margin: "20px 0",
    },
    controls: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    button: { padding: "10px", borderRadius: "5px", cursor: "pointer", background: "gray", color: "white" },
    startButton: { background: "yellow", padding: "10px", borderRadius: "5px", cursor: "pointer" },
    pauseButton: { background: "orange", padding: "10px", borderRadius: "5px", cursor: "pointer" },
    resumeButton: { background: "lightgreen", padding: "10px", borderRadius: "5px", cursor: "pointer" },
    stopButton: { background: "red", padding: "10px", borderRadius: "5px", cursor: "pointer", color: "white" },
    restartButton: { background: "white", padding: "10px", borderRadius: "5px", cursor: "pointer" },
    saveButton: { background: "lightblue", padding: "10px", borderRadius: "5px", cursor: "pointer" },
  };
  
  export default PomodoroTimer;