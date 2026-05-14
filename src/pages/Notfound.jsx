import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(to bottom, #020111 0%, #071433 45%, #020b1f 100%)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Poppins, sans-serif",
          // color: "#fff",
        }}
      >
        {/* Navy Blue Glow */}
        <div
          style={{
            position: "absolute",
            right: "-180px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(37,99,235,0.45) 35%, rgba(2,6,23,0) 75%)",
            filter: "blur(30px)",
            animation: "navyGlow 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />

        {/* Stars */}
        {[...Array(140)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 4 + "px",
              height: Math.random() * 4 + "px",
              background: "white",
              borderRadius: "50%",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 2}s infinite`,
            }}
          />
        ))}

        {/* Flying Full Body Space Man */}
        <div
          style={{
            position: "absolute",
            top: "18%",
            right: "-50px",
            zIndex: 2,
            animation: "spaceMove 12s linear infinite",
          }}
        >
          <span
            style={{
              fontSize: "220px",
              display: "block",
              filter: "drop-shadow( rgba(255,255,255,0.7))",
            }}
          >
            👨‍🚀
          </span>
        </div>

        {/* Main Content */}
        <div
          style={{
            textAlign: "center",
            zIndex: 2,
            padding: "20px",
          }}
        >
          {/* 404 */}
          <h1
            style={{
              fontSize: "180px",
              margin: 0,
              color: "#fff",
              // textShadow: "0 0 40px rgba(255,255,255,0.9)",
            }}
          >
            404
          </h1>

          {/* Title */}
          <h2
            style={{
              fontSize: "42px",
              marginTop: "10px",
              marginBottom: "15px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Lost In Space
          </h2>

          {/* Description */}
          <p
            style={{
              maxWidth: "580px",
              lineHeight: "1.9",
              color: "#dbeafe",
              margin: "0 auto 35px",
              fontSize: "17px",
            }}
          >
            The page you are trying to reach drifted into another galaxy.
            Navigate back to Earth and continue your journey.
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "15px 42px",
              border: "none",
              borderRadius: "40px",
              background: "linear-gradient(45deg, #0d3379, #0a2569, #021b52)",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.08)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            🚀 Return Home
          </button>
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes spaceMove {
              0% {
                transform: translateX(0) translateY(0) rotate(0deg);
                opacity: 0;
              }

              10% {
                opacity: 1;
              }

              25% {
                transform: translateX(-350px) translateY(-30px) rotate(-8deg);
              }

              50% {
                transform: translateX(-700px) translateY(20px) rotate(6deg);
              }

              75% {
                transform: translateX(-1050px) translateY(-25px) rotate(-4deg);
              }

              100% {
                transform: translateX(-1450px) translateY(0px) rotate(0deg);
                opacity: 0;
              }
            }

            @keyframes twinkle {
              0% {
                opacity: 0.2;
              }

              50% {
                opacity: 1;
              }

              100% {
                opacity: 0.2;
              }
            }

            @keyframes navyGlow {
              0% {
                transform: translateY(-50%) scale(1);
                opacity: 0.7;
              }

              50% {
                transform: translateY(-50%) scale(1.1);
                opacity: 1;
              }

              100% {
                transform: translateY(-50%) scale(1);
                opacity: 0.7;
              }
            }

            @media (max-width: 768px) {
              h1 {
                font-size: 100px !important;
              }

              h2 {
                font-size: 28px !important;
              }

              p {
                font-size: 15px !important;
                padding: 0 20px;
              }

              img {
                width: 200px !important;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default Notfound;
