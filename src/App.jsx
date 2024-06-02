import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/sign_up" element={<SignUp />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<ProtectedRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
