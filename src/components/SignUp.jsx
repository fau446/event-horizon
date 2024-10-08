import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Feedback from "./Feedback";
import styles from "../styles/LoginSignUp.module.css";

function SignUp() {
  const navigate = useNavigate();
  const APIURL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/auth/sign_up`, {
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
        setIsLoading(false);
        return;
      }

      localStorage.setItem("access_token", jsonData.access_token);
      setError(false);
      setFeedbackMessage("Sign up Successful!");
      navigate("/");
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
      setIsLoading(false);
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
    <div className={styles.container}>
      <div className={styles.main}>
        <h1 className={styles.title}>Event Horizon</h1>
        {feedbackMessage !== "" && (
          <Feedback message={feedbackMessage} error={error} />
        )}
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <h2>Sign Up</h2>
            <div className={styles.field}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {isLoading ? (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <button className={styles.button}>Sign Up</button>
            )}
          </form>
          <div className={styles.authFooter}>
            <span>Already have an account?</span>
            <a onClick={() => navigate("/login")}> Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
