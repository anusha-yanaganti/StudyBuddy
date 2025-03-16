import { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar"; 
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setNewName(res.data.name);
        setSelectedAvatar(res.data.avatar);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);


  const handleSave = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
            "http://localhost:5000/api/user/update",
            { name: newName, avatar: selectedAvatar }, // Only update name & avatar
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(res.data.user);
        localStorage.setItem("userAvatar", selectedAvatar); // ✅ Store in localStorage
        setIsEditing(false);
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
    }
};


  const handleClose = () => {
    setIsEditing(false);
  };

  const handleExitProfile = () => {
    navigate(-1); // Change to your desired exit page
  };

  if (loading) {
    return <h2 className="loading-text">Loading profile...</h2>;
  }

  return (
    <div className="profile-container">
      <i className="fa fa-times close-icon" onClick={handleExitProfile}></i>

      <h2 className="profile-title">Your Profile</h2>

      <img
        src={user?.avatar || "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?semt=ais_hybrid"}
        alt="Avatar"
        className="avatar-img"
      />

      {isEditing ? (
        <>
          <i className="fa fa-arrow-left back-arrow" onClick={handleClose}></i>

          <Avatar selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="edit-input" />
          <button onClick={handleSave} className="save-btn">Save</button>
        </>
      ) : (
        <>
          <h3 className="profile-text">{user?.name}</h3>
          <p className="profile-text">{user?.email}</p>
          <p className="profile-text">Daily Progress: {user?.progress?.daily || 0}%</p>
          <p className="profile-text">Weekly Progress: {user?.progress?.weekly || 0}%</p>

          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;
