import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Feedback from "./Feedback";
import styles from "../styles/LoginSignUp.module.css";

function Login() {
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

    // if login as example user button clicked
    if (e.type === "click") {
      formData.email = "user1@example.com";
      formData.password = "password1";
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/auth/login`, {
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
      setFeedbackMessage("Login Successful!");
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
            <h2>Login</h2>
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
              <div className={styles.buttons}>
                <button className={styles.button}>Login</button>
                <button
                  type="button"
                  className={styles.exampleButton}
                  onClick={handleFormSubmit}
                >
                  Login as example user
                </button>
              </div>
            )}
          </form>

          <div className={styles.authFooter}>
            <span>New to Event Horizon?</span>
            <a onClick={() => navigate("/sign_up")}> Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
