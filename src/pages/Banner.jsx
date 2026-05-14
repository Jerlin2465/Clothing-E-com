import React, { useEffect, useState } from "react";
import axios from "axios";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://clothing-backend-volk.onrender.com";

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
      <div>
        {banners.map((banner) => (
          <div key={banner._id}>
            <img
              src={`${API_URL}/uploads/${banner.image}`}
              alt="banner"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Banner;
