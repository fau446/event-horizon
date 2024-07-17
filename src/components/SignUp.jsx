import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import Feedback from "./Feedback";

function SignUp() {
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
      const response = await fetch(`${API_URL}/auth/sign_up`, {
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
      setFeedbackMessage("Sign up Successful!");
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
      <h2>Sign Up</h2>
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
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button>Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;
