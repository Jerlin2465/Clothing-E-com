import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../csspage/Home.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const API_URL =
  import.meta.env.VITE_API_URL || "https://clothing-backend-volk.onrender.com";

const HomeProducts = ({ category }) => {
  const [product, setProduct] = useState([]);
  const [slideimg, setSlideimg] = useState({});
  const [like, setLike] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= GET PRODUCTS =================
  const getProduct = async () => {
    try {
      setLoading(true);

      // PRODUCTS
      const res = await axios.get(`${API_URL}/get-product`, {
        params: {
          category: category || undefined,
        },
      });

      const productsData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      setProduct(productsData);

      // ================= WISHLIST =================
      const token = localStorage.getItem("token");

      // ONLY LOGIN USER
      if (token) {
        const wishlistRes = await axios.get(`${API_URL}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const likedIds = wishlistRes.data.items.map(
          (item) => item.productId?._id,
        );

        setLike(likedIds);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      setProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [category]);

  // ================= WISHLIST TOGGLE =================
  const handleToggle = async (id) => {
    const token = localStorage.getItem("token");

    // LOGIN CHECK
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // REMOVE
      if (like.includes(id)) {
        await axios.delete(`${API_URL}/wishlist/remove`, {
          data: {
            productId: id,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLike((prev) => prev.filter((item) => item !== id));
      }

      // ADD
      else {
        await axios.post(
          `${API_URL}/wishlist/add`,
          {
            productId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setLike((prev) => [...prev, id]);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="product-home-page">
      <div className="product-home-container">
        {/* ================= SKELETON ================= */}

        {loading &&
          Array.from(new Array(8)).map((_, index) => (
            <div className="product-home-card" key={index}>
              <Box>
                {/* IMAGE */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={260}
                  sx={{
                    borderRadius: "10px",
                  }}
                />

                {/* TITLE */}
                <Skeleton
                  width="80%"
                  height={35}
                  sx={{
                    marginTop: "10px",
                  }}
                />

                {/* DESCRIPTION */}
                <Skeleton width="60%" />

                {/* CATEGORY */}
                <Skeleton width="40%" />

                {/* PRICE */}
                <Skeleton width="30%" height={35} />
              </Box>
            </div>
          ))}

        {/* ================= PRODUCTS ================= */}

        {!loading &&
          product.map((item) => {
            const currentIndex = slideimg[item._id] || 0;

            return (
              <div className="product-home-card" key={item._id}>
                {/* IMAGE */}
                <div className="image-box">
                  <span className="badge">{item.gender}</span>

                  <img
                    src={`${API_URL}/uploads/${item.image?.[currentIndex]}`}
                    alt="product"
                    onClick={() => navigate(`/product/${item._id}`)}
                  />

                  {/* HEART */}
                  <span
                    className="badg-1"
                    style={{
                      cursor: "pointer",
                      marginLeft: "20px",
                    }}
                    onClick={() => handleToggle(item._id)}
                  >
                    <FaHeart
                      style={{
                        color: like.includes(item._id) ? "red" : "#ccc",

                        fontSize: "20px",
                      }}
                    />
                  </span>
                </div>

                {/* TEXT */}
                <div
                  className="home-product-text"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <p className="name">{item.productName}</p>

                  <p className="desc">{item.description}</p>

                  <p className="desc">{item.category}</p>

                  <div className="price">₹{item.price}</div>
                </div>

                {/* BUTTON */}
                <div className="bottom">
                  <div
                    className="action-text"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    View Details →
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default HomeProducts;
