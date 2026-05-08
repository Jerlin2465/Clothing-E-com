import React, { useEffect, useState } from "react";
import "../csspage/Product.css";
import "../csspage/Home.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const API_URL =
  import.meta.env.VITE_API_URL || "https://clothing-backend-volk.onrender.com";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [slideimg, setSlideimg] = useState(0);
  const [like, setLike] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const getData = async () => {
    try {
      setLoading(true);

      const allProducts = await axios.get(`${API_URL}/get-product`);

      const allData = Array.isArray(allProducts.data)
        ? allProducts.data
        : allProducts.data.products || [];

      setProducts(allData);

      if (id) {
        const single = await axios.get(`${API_URL}/get-product/${id}`);

        setProduct(single.data);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      setProducts([]);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    setSelectedSize("");
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!user) {
      alert("Please login");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/cart/add`,
        { productId, size: selectedSize },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/cart");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleToggle = async (itemId) => {
    try {
      if (like.includes(itemId)) {
        await axios.delete(`${API_URL}/wishlist/remove`, {
          data: { productId: itemId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLike((prev) => prev.filter((i) => i !== itemId));
      } else {
        await axios.post(
          `${API_URL}/wishlist/add`,
          { productId: itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setLike((prev) => [...prev, itemId]);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <>

      {loading && (
        <div className="pro-page">
          <div className="pro-container">
            {/* LEFT IMAGE */}
            <div className="pro-page-img-main">
              <div className="pro-mini-img">
                {Array.from(new Array(4)).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={70}
                    height={90}
                    animation="wave"
                    sx={{
                      borderRadius: "10px",
                      marginBottom: "10px",
                    }}
                  />
                ))}
              </div>

              <Skeleton
                variant="rectangular"
                width={450}
                height={550}
                animation="wave"
                sx={{ borderRadius: "10px" }}
              />
            </div>

            {/* RIGHT TEXT */}
            <div className="pro-page-text-main">
              <Skeleton width="60%" height={50} animation="wave" />

              <Skeleton width="30%" height={40} animation="wave" />

              <Skeleton width="90%" height={30} animation="wave" />

              <Skeleton width="80%" height={30} animation="wave" />

              {/* SIZE */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {Array.from(new Array(4)).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width={50}
                    height={50}
                    animation="wave"
                  />
                ))}
              </div>

              {/* BUTTON */}
              <Skeleton
                variant="rounded"
                width={180}
                height={50}
                animation="wave"
                sx={{ marginTop: "30px" }}
              />
            </div>
          </div>
        </div>
      )}


      {!loading && id && product && (
        <div className="pro-page">
          <div className="pro-container">
            <div className="pro-page-img-main">
              <div className="pro-mini-img">
                {product.image?.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_URL}/uploads/${img}`}
                    onClick={() => setSlideimg(i)}
                    style={{
                      cursor: "pointer",
                      border:
                        slideimg === i ? "2px solid black" : "1px solid #ddd",
                    }}
                    alt=""
                  />
                ))}
              </div>

              <div>
                <img
                  src={`${API_URL}/uploads/${product.image?.[slideimg]}`}
                  alt=""
                />
              </div>
            </div>

            <div
              className="pro-page-text-main"
              style={{
                position: "relative",
                zIndex: 5,
              }}
            >
              <h2>{product.productName}</h2>

              <p>₹ {product.price}</p>

              <p>{product.description}</p>

              <div className="size-box">
                {product.size?.length > 0
                  ? product.size.map((s, i) => (
                      <span
                        key={i}
                        onClick={() => setSelectedSize(s.size)}
                        style={{
                          padding: "8px 12px",
                          marginRight: "10px",
                          cursor: "pointer",
                          borderRadius: "10px",
                          fontSize: "25px",
                          backgroundColor:
                            selectedSize === s.size ? "black" : "#ccc",
                          color: selectedSize === s.size ? "#fff" : "#000",
                        }}
                      >
                        {s.size}
                      </span>
                    ))
                  : "No sizes"}
              </div>

              <button
                className="btn-1-pro"
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 10,
                }}
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="product-pro-page">
        {id && <h2 style={{ margin: "20px" }}>More Products</h2>}

        <div className="product-pro-container">
          {/* CARD SKELETON */}
          {loading &&
            Array.from(new Array(8)).map((_, index) => (
              <div className="product-pro-card" key={index}>
                <Box>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={260}
                    animation="wave"
                    sx={{
                      borderRadius: "10px",
                    }}
                  />

                  <Skeleton
                    width="80%"
                    height={35}
                    animation="wave"
                    sx={{
                      marginTop: "10px",
                    }}
                  />

                  <Skeleton width="60%" animation="wave" />

                  <Skeleton width="40%" animation="wave" />

                  <Skeleton width="30%" height={35} animation="wave" />
                </Box>
              </div>
            ))}

          {!loading &&
            products
              .filter((item) => item._id !== id)
              .map((item) => (
                <div
                  className="product-pro-card"
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <div className="image-box">
                    <span className="badge">{item.gender}</span>

                    <img
                      src={`${API_URL}/uploads/${item.image?.[0]}`}
                      alt="product"
                    />

                    <span
                      className="badg-1"
                      style={{
                        cursor: "pointer",
                        marginLeft: "20px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        handleToggle(item._id);
                      }}
                    >
                      <FaHeart
                        style={{
                          color: like.includes(item._id) ? "red" : "#ccc",
                          fontSize: "20px",
                        }}
                      />
                    </span>
                  </div>

                  <div className="product-pro-text">
                    <p className="name">{item.productName}</p>

                    <p className="desc">{item.description}</p>

                    <p className="desc">{item.category}</p>

                    <div className="price">₹{item.price}</div>
                  </div>

                  <div className="bottom">
                    <div>View Details →</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Product;
