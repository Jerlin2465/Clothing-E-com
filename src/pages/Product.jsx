import React, { useEffect, useState } from "react";
import "../csspage/Product.css";
import "../csspage/Home.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [slideimg, setSlideimg] = useState(0);

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
    window.scrollTo(0, 0);
  }, [id]);

  //
  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.post(
        "http://localhost:5000/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("add to cart page");
      navigate("/cart");
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

            <div className="pro-page-text-main">
              <h2>{product.productName}</h2>
              <p>₹ {product.price}</p>
              <p>{product.description}</p>

              <div className="size-box">
                {product.size?.length > 0
                  ? product.size.map((s, i) => (
                      <span key={i} className="size-item">
                        {s.size}
                      </span>
                    ))
                  : "No sizes"}
              </div>

              <button
                className="btn-1-pro"
                onClick={() => handleAddToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  PRODUCT LIST  */}
      <div className="product-pro-page">
        {id && <h2 style={{ margin: "20px" }}>More Products</h2>}

        <div className="product-pro-container">
          {products
            .filter((item) => item._id !== id)
            .map((item) => (
              <div className="product-pro-card" key={item._id}>
                <div className="image-box">
                  <img
                    src={`http://localhost:5000/uploads/${item.image?.[0]}`}
                    alt="product"
                  />
                  <span className="badge">{item.gender}</span>
                </div>

                <div
                  className="product-pro-text"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <p className="name">{item.productName}</p>
                  <p className="desc">{item.description}</p>
                  <div className="price">₹{item.price}</div>
                </div>
                <div className="bottom">
                  <div onClick={() => navigate(`/product/${item._id}`)}>
                    View Details →
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default Product;
