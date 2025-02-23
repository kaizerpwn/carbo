import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const useCoins = () => {
  const { user } = useAuth();
  const [totalCoins, setTotalCoins] = useState<number>(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const response = await axios.get(`/api/user/stats?userId=${user.id}`);
          setTotalCoins(response.data.totalCoins);
        } catch (error) {
          console.error("Failed to fetch user stats:", error);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  return totalCoins;
};

export default useCoins;
