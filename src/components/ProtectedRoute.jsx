import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";

const ProtectedRoute = ({ component: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/auth/check_authentication`, {
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
    return <p>Loading...</p>;
  }

  return isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;
