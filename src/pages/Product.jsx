import React, { useEffect, useState } from "react";
import "../csspage/Product.css";
import "../csspage/Home.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [slideimg, setSlideimg] = useState(0);
  const [like, setLike] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const token = localStorage.getItem("token");

  const getData = async () => {
    try {
      const allProducts = await axios.get(
        "http://localhost:5000/get-product/get-product",
      );
      setProducts(allProducts.data);

      if (id) {
        const single = await axios.get(
          `http://localhost:5000/get-product/get-product/${id}`,
        );
        setProduct(single.data);
      }
    } catch (error) {
      console.log(error.message);
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
      alert("Please login ");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        {
          productId,
          size: selectedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Added to cart");
      navigate("/cart");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  //  WISHLIST
  const handleToggle = async (id) => {
    try {
      if (like.includes(id)) {
        await axios.delete("http://localhost:5000/wishlist/remove", {
          data: { productId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLike((prev) => prev.filter((item) => item !== id));
      } else {
        await axios.post(
          "http://localhost:5000/wishlist/add",
          { productId: id },
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
    <>
      {id && product && (
        <div className="pro-page">
          <div className="pro-container">
            <div className="pro-page-img-main">
              <div className="pro-mini-img">
                {product.image?.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/uploads/${img}`}
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
                  src={`http://localhost:5000/uploads/${product.image?.[slideimg]}`}
                  alt=""
                />
              </div>
            </div>

            <div
              className="pro-page-text-main"
              style={{ position: "relative", zIndex: 5 }}
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
                            selectedSize === s.size ? " black" : " #ccc",
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

      {/* more product */}
      <div className="product-pro-page">
        {id && <h2 style={{ margin: "20px" }}>More Products</h2>}

        <div className="product-pro-container">
          {products
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
                    src={`http://localhost:5000/uploads/${item.image?.[0]}`}
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

                <div className="product-pro-text">
                  <p className="name">{item.productName}</p>
                  <p className="desc">{item.description}</p>
                  <p className="desc"> {item.category}</p>

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
