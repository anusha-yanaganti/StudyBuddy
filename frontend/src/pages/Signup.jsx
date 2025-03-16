import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import studyImage from "../assets/SBimg.jpg";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Account created successfully!");
      navigate("/"); // Redirect to login page
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Validation errors
          alert(error.response.data.errors.map(err => err.msg).join("\n"));
        } else if (error.response.data.msg) {
          // Other server-side errors
          alert(error.response.data.msg);
        }
      } else {
        alert("Something went wrong! Please try again.");
      }
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h2 className="brand-title">StudyBuddy</h2>
        <img src={studyImage} alt="Study" className="study-image" />
        <p className="tagline">Find the perfect study resources for every subject!</p>

      </div>

      <div className="signup-right">
        <h2 className="title">Sign up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Enter Your Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Re-enter Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" className="submit-btn">Create account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
