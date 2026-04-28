import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../csspage/Home.css";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

const HomeProducts = () => {
  const [product, setProduct] = useState([]);
  const [slideimg, setSlideimg] = useState({});

  const navigate = useNavigate();

  const getProduct = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/get-product/get-product",
      );
      setProduct(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="product-home-page">
      <div className="product-home-container">
        {product.map((item) => {
          const currentIndex = slideimg[item._id] || 0;

          return (
            <div className="product-home-card" key={item._id}>
              {/* IMAGE */}
              <div className="image-box">
                <span className="badge">{item.gender}</span>

                <img
                  src={`http://localhost:5000/uploads/${item.image?.[currentIndex]}`}
                  alt="product"
                />
                <span className="badg-1">
                  <FaRegHeart />
                </span>
              </div>

              <div
                className="home-product-text"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <p className="name">{item.productName}</p>
                <p className="desc">{item.description}</p>
                <div className="price">₹{item.price}</div>
              </div>

              {/* BOTTOM */}
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
