import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../csspage/Home.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "https://clothing-backend-volk.onrender.com";

const HomeProducts = ({ category }) => {
  const [product, setProduct] = useState([]);
  const [slideimg, setSlideimg] = useState({});
  const [like, setLike] = useState([]);

  const navigate = useNavigate();

  const getProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-product`, {
        params: {
          category: category || undefined,
        },
      });
      setProduct(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, [category]);

  const handleToggle = async (id) => {
    try {
      if (like.includes(id)) {
        await axios.delete(`${API_URL}/wishlist/remove`, {
          data: { productId: id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLike((prev) => prev.filter((item) => item !== id));
      } else {
        await axios.post(
          `${API_URL}/wishlist/add`,
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        {product.map((item) => {
          const currentIndex = slideimg[item._id] || 0;

          return (
            <div className="product-home-card" key={item._id}>
              <div className="image-box">
                <span className="badge">{item.gender}</span>

                <img
                  src={`${API_URL}/uploads/${item.image?.[currentIndex]}`}
                  alt="product"
                />

                <span
                  className="badg-1"
                  style={{ cursor: "pointer", marginLeft: "20px" }}
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

              <div
                className="home-product-text"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <p className="name">{item.productName}</p>
                <p className="desc">{item.description}</p>
                <p className="desc">{item.category}</p>
                <div className="price">₹{item.price}</div>
              </div>

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
