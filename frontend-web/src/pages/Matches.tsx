import React from "react";
import { useAuth } from "../hooks/useAuth";
import { DiscoveryFeed } from "../components/DiscoveryFeed";

export const Matches: React.FC = () => {
  const auth = useAuth();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Вітаємо, {auth.user?.name}!</h2>
      <button
        onClick={auth.logout}
        style={{
          padding: "10px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Вийти з акаунта
      </button>

      {/* Інтегруємо нашу оптимізовану стрічку свайпів */}
      <DiscoveryFeed />
    </div>
  );
};

export default Matches;
