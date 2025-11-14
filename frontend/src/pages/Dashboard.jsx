import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.status === 200) {
          setBalance(response.data.balance);
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          alert("Error fetching balance");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [navigate]);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        {loading ? (
          <div className="font-bold text-lg">Loading balance...</div>
        ) : (
          <Balance value={balance} />
        )}
        <Users />
      </div>
    </div>
  );
};
