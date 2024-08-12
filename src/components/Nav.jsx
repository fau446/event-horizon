import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import styles from "../styles/Nav.module.css";

function Nav({ loggedInUser }) {
  const navigate = useNavigate();

  async function logout() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.nav}>
      <div className={styles.top}>
        <h1>Event Horizon</h1>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className={styles.bottom}>
        <h2>Welcome back {loggedInUser}!</h2>
      </div>
    </div>
  );
}

export default Nav;
