import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./TimetablePage.css"; // Style file for later
import Sidebar from "./Sidebar";

const TimetablePage = () => {
  const [timetables, setTimetables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: "", studyHours: "" });
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editId, setEditId] = useState(null); // Store the ID of the plan being edited
  const navigate = useNavigate(); // Navigation hook

  // Fetch Timetables on Load
  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/timetable", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTimetables(res.data);
    } catch (err) {
      console.error("Error fetching timetables:", err);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  };

  // Add or Update Timetable
  const saveTimetable = async () => {
    try {
      if (editMode) {
        // Update existing timetable
        await axios.put(
          `http://localhost:5000/api/timetable/${editId}`,
          { subjects: [{ name: newPlan.name, studyHours: newPlan.studyHours }] },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        // Add new timetable
        await axios.post(
          "http://localhost:5000/api/timetable",
          { subjects: [{ name: newPlan.name, studyHours: newPlan.studyHours }] },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      fetchTimetables();
      setShowModal(false);
      setNewPlan({ name: "", studyHours: "" });
      setEditMode(false); // Reset edit mode
      setEditId(null);
    } catch (err) {
      console.error("Error saving timetable:", err);
    }
  };

  // Edit Timetable
  const editTimetable = (plan) => {
    setNewPlan({
      name: plan.subjects[0].name,
      studyHours: plan.subjects[0].studyHours,
    });
    setEditMode(true);
    setEditId(plan._id);
    setShowModal(true);
  };

  // Delete Timetable
  const deleteTimetable = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/timetable/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Delete response:", response.data); // Log response
  
      // ✅ Ensure UI updates after last item is deleted
      setTimetables((prev) => prev.filter((plan) => plan._id !== id));
  
    } catch (err) {
      console.error("Error deleting timetable:", err.response?.data || err);
    }
  };  

  // Navigate to detailed view page
  const viewDetails = (id) => {
    navigate(`/timetable/${id}`); // Navigate to the detailed page with subject ID
  };
  

  return (
    <div className="home-wrapper">
      {/* Sidebar */}
      <Sidebar />
      <div className="timetable-container">
        <h2>Add Your Learning Plan</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add New Plan
        </button>

        {/* Timetable List */}
        <div className="timetable-list">
          {timetables.length > 0 ? (
            timetables.map((plan) => (
              <div key={plan._id} className="timetable-card">
                <span>
                  {plan.subjects[0].name} - {plan.subjects[0].studyHours} hrs
                </span>
                <div className="actions">
                  <button className="icon-btn edit-icon" onClick={() => editTimetable(plan)}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn delete-icon" onClick={() => deleteTimetable(plan._id)}>
                    <FaTrash />
                  </button>
                  <button className="view-btn" onClick={() => viewDetails(plan._id)}>View in Detail</button>
                </div>
              </div>
            ))
          ) : (
            <p>No timetables added yet.</p>
          )}
        </div>

        {/* Modal for Adding or Editing Plan */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>{editMode ? "Edit Study Plan" : "Add New Study Plan"}</h3>
              <input
                type="text"
                name="name"
                placeholder="Subject Name"
                value={newPlan.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="studyHours"
                placeholder="Study Hours"
                value={newPlan.studyHours}
                onChange={handleChange}
              />
              <button onClick={saveTimetable}>{editMode ? "Update" : "Save"}</button>
              <button onClick={() => { setShowModal(false); setEditMode(false); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
