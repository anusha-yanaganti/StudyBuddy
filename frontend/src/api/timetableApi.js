import axios from "axios";

const API_URL = "http://localhost:5000/api/timetable";

// Function to attach token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Fetch Timetable
export const fetchTimetable = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Add New Entry
export const addTimetableEntry = async (timetableData) => {
    try {
      const response = await axios.post(API_URL, timetableData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding timetable entry:", error.response?.data || error);
      throw error;
    } 
  };

// ✅ Update Timetable
export const updateTimetable = async (id, subjects) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { subjects },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating timetable:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Delete Timetable
export const deleteTimetable = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting timetable:", error.response?.data || error.message);
    throw error;
  }
};
