import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "80px", margin: 0 }}>404</h1>

      <h2>Page Not Found</h2>

      <p>The page you are looking for does not exist.</p>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          border: "none",
          background: "#1a237e",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default Notfound;