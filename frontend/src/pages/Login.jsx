import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "./Login.css";
import studyImage from "../assets/SBimg.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "", // Include name field
    email: "",
    password: "",
  });
  console.log("Sending data:", formData);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password, // ✅ No need to send name
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name); // ✅ Store name in localStorage
      navigate("/home"); 
    } catch (error) {
      alert(error.response?.data?.msg || "Login failed!");
    }
};
  return (
    <div className="login-container">
      <div className="login-left">
        <img src={studyImage} alt="Study" className="study-image" />
        <h1 className="brand-title">StudyBuddy</h1>
        <p className="tagline">Find the perfect study resources for every subject!</p>
      </div>
      <div className="login-right">
        <h2 className="title">Login Here..</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Enter Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>

        <p className="signup-text">If you don’t have an account</p>
        <button onClick={() => navigate("/signup")} className="signup-btn">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
