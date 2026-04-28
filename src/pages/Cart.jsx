import React, { useEffect, useState } from "react";
import "../csspage/Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCart(res.data.items || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleIncrease = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrease = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete("http://localhost:5000/cart/remove", {
        data: { productId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      getCart();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="product-page-cart">
      <div className="product-container-cart">
        {cart.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "591px",
            }}
          >
            <button
              onClick={() => navigate("/product")}
              style={{
                padding: 20,
                width: "200px",
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
                background: "#fff",
                fontSize: "20px",
              }}
            >
              Go To Shop
            </button>
          </div>
        ) : (
          cart.map((item) => {
            const product = item.productId;
            if (!product) return null;

            return (
              <div className="product-card-cart" key={product._id}>
                <img
                  src={`http://localhost:5000/uploads/${product.image?.[0]}`}
                  alt="Product"
                />

                <div className="product-card-cart">
                  <h3>{product.productName}</h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p
                      onClick={() => handleDecrease(product._id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        userSelect: "none",
                      }}
                    >
                      -
                    </p>

                    <p>{item.quantity}</p>

                    <p
                      onClick={() => handleIncrease(product._id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        userSelect: "none",
                      }}
                    >
                      +
                    </p>
                  </div>

                  <p>₹ {product.price}</p>

                  <button onClick={() => handleDelete(product._id)}>
                    Remove
                  </button>
                </div>
                <button>Proceed To Pay</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Cart;
