import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const getBanners = async () => {
    try {
      const res = await axios.get(`${API_URL}/banner/all`);

      setBanners(res.data.banners || []);
    } catch (error) {
      console.log(error);
      setBanners([]);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  return (
    <>
      <Box sx={{ mt: 11 }}>
        {banners.map((banner) => (
          <div key={banner._id}>
            <img
              src={`${API_URL}/uploads/${banner.image}`}
              alt="banner"
              style={{
                width: "100%",
                height: "600px",
              }}
            />
          </div>
        ))}
      </Box>
    </>
  );
};

export default Banner;
