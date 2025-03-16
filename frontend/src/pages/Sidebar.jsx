import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaClock, FaCalendar, FaChartLine } from "react-icons/fa";
import defaultAvatar from "../assets/default-avatar.png"; // Default profile picture

const Sidebar = ({ userAvatar }) => {
  
const navigate = useNavigate();

  return (
    <div className="sidebar">
      {/* Make Avatar Clickable */}
      <img
        src={userAvatar || defaultAvatar}
        alt="User Avatar"
        className="avatar"
        onClick={() => navigate("/profile")} // ✅ Navigate to profile page on click
        style={{ cursor: "pointer" }} // Add cursor pointer for better UX
      />

      <nav className="nav-icons">
        <FaClock className="icon" title="Pomodoro Timer" />
        <Link to="/timetable">
  <FaCalendar className="icon" title="Timetable" />
</Link>
        <FaChartLine className="icon" title="Progress Tracker" />
      </nav>
    </div>
  );
};

export default Sidebar;
