import { useState, useEffect } from "react";
import API_URL from "../assets/api-url";
import { useNavigate } from "react-router-dom";
import Feedback from "./Feedback";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [error, setError] = useState(false);

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
      if (jsonData.error) {
        setError(true);
        setFeedbackMessage(jsonData.error);
        return;
      }

      localStorage.setItem("access_token", jsonData.access_token);
      setError(false);
      setFeedbackMessage("Login Successful!");
      navigate("/");
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <>
      <h2>Login</h2>
      {feedbackMessage !== "" && (
        <Feedback message={feedbackMessage} error={error} />
      )}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button>Login</button>
      </form>
    </>
  );
}

export default Login;
