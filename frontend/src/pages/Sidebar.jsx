import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaClock, FaCalendar, FaChartLine } from "react-icons/fa";
import defaultAvatar from "../assets/default-avatar.png"; // Default profile picture

const Sidebar = () => {
    const navigate = useNavigate();
    const [userAvatar, setUserAvatar] = useState(localStorage.getItem("userAvatar") || defaultAvatar);

    useEffect(() => {
        const handleStorageChange = () => {
            setUserAvatar(localStorage.getItem("userAvatar") || defaultAvatar);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <div className="sidebar">
            {/* ✅ Display Updated Avatar */}
            <img
                src={userAvatar}
                alt="User Avatar"
                className="avatar"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
            />

            <nav className="nav-icons">
                <Link to="/pomodoro">
                    <FaClock className="icon" title="Pomodoro Timer" />
                </Link>
                <Link to="/timetable">
                    <FaCalendar className="icon" title="Timetable" />
                </Link>
                <Link to="/progress">
                    <FaChartLine className="icon" title="Progress Tracker" />
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
