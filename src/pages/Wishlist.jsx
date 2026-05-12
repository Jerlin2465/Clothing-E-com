import React, { useEffect, useState } from "react";
import axios from "axios";
import "../csspage/Home.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "https://clothing-backend-volk.onrender.com";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [like, setLike] = useState([]);

  const navigate = useNavigate();

  // GET WISHLIST
  const getWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      // LOGIN CHECK
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(res.data.items || []);
    } catch (error) {
      console.log(error.response?.data || error.message);

      // INVALID TOKEN
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/wishlist/remove`, {
        data: { productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist((prev) =>
        prev.filter((item) => item.productId?._id !== productId),
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleColor = (id) => {
    if (like.includes(id)) {
      setLike(like.filter((item) => item !== id));
    } else {
      setLike([...like, id]);
    }
  };

  return (
    <>
      {wishlist.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "20px",
          }}
        >
          <h2>Your Wishlist is Empty</h2>

          <button
            onClick={() => navigate("/product")}
            style={{
              padding: "12px 20px",
              width: "200px",
              border: "none",
              cursor: "pointer",
              borderRadius: "8px",
              background: "#000cff",
              color: "#fff",
              fontSize: "16px",
            }}
          >
            Go To Shop 🛒
          </button>
        </div>
      ) : (
        <div className="product-home-page" style={{ marginTop: "70px" }}>
          <div className="product-home-container">
            {wishlist.map((item) => {
              const product = item.productId;

              if (!product) return null;

              return (
                <div className="product-home-card" key={product._id}>
                  {/* IMAGE */}
                  <div className="image-box">
                    <span className="badge">{product.gender}</span>

                    <img
                      src={`${API_URL}/uploads/${product.image?.[0]}`}
                      alt={product.productName}
                    />

                    <span
                      className="badg-1"
                      style={{
                        cursor: "pointer",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        handleDelete(product._id);
                        handleColor(item._id);
                      }}
                    >
                      <FaHeart
                        style={{
                          color: like.includes(item._id) ? "#ccc" : "red",
                          fontSize: "20px",
                        }}
                      />
                    </span>
                  </div>

                  {/* TEXT */}
                  <div
                    className="home-product-text"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <p className="name">{product.productName}</p>

                    <p className="desc">{product.description}</p>

                    <div className="price">₹{product.price}</div>
                  </div>

                  {/* BOTTOM */}
                  <div className="bottom">
                    <div
                      className="action-text"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      View Details →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
