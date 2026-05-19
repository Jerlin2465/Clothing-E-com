import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/banner/all`)
      .then((res) => {
        setBanners(res.data.banners || []);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box
      sx={{
        mt: 11,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          animation: "scroll 20s linear infinite",
          gap: 1,

          "@keyframes scroll": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: "translateX(-50%)",
            },
          },
        }}
      >
        {[...banners, ...banners].map((banner, index) => (
          <Box
            key={index}
            sx={{
              minWidth: "100vw",
              flexShrink: 0,
            }}
          >
            <img
              src={`${API_URL}/uploads/${banner.image}`}
              alt="banner"
              style={{
                width: "100%",
                height: "650px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Banner;
