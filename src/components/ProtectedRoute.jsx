import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProtectedRoute.module.css";

const ProtectedRoute = ({ component: Component }) => {
  const navigate = useNavigate();
  const APIURL = import.meta.env.VITE_API_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${APIURL}/auth/check_authentication`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const jsonData = await response.json();
          setIsAuthenticated(true);
          setLoggedInUser(jsonData.logged_in_as);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthentication();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Component loggedInUser={loggedInUser} /> : null;
};

export default ProtectedRoute;
