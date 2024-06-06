import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

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
      console.log(jsonData);
      if (jsonData.error) {
        console.log(jsonData.error);
        return;
      }
      console.log("Account Creation Successful!");

      localStorage.setItem("access_token", jsonData.access_token);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h2>Sign Up</h2>
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
