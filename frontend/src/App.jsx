import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Timetable from "./pages/TimetablePage";
import ViewDetailsPage from "./pages/ViewDetails";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/timetable" element={<Timetable />}/>
        <Route path="/timetable/:id" element={<ViewDetailsPage />}/>
      </Routes>
    </Router>
  );
};

export default App;
