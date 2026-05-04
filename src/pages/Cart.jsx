import React, { useEffect, useState } from "react";
import "../csspage/Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Paper } from "@mui/material";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.items || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleIncrease = async (item) => {
    const newQty = item.quantity + 1;
    await axios.put(
      "http://localhost:5000/cart/update",
      {
        productId: item.productId,
        size: item.size,
        quantity: newQty,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    getCart();
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    await axios.put(
      "http://localhost:5000/cart/update",
      {
        productId: item.productId,
        size: item.size, 
        quantity: newQty,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    getCart();
  };

  const handleDelete = async (item) => {
    await axios.delete("http://localhost:5000/cart/remove", {
      data: {
        productId: item.productId,
        size: item.size,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    getCart();
  };

  return (
    <div className="product-page-cart">
      <div className="product-container-cart">
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "200px" }}>
            <h2>Cart is Empty</h2>
            <button
              onClick={() => navigate("/product")}
              style={{
                border: "none",
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px 30px 10px 30px",
                borderRadius: "10px",
                fontSize: "20px",
              }}
            >
              Go To Shop 🛒
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                className="product-card-cart"
                key={`${item.productId}-${item.size}`}
              >
                <img
                  src={`http://localhost:5000/uploads/${item.image?.[0]}`}
                  alt=""
                />

                <h3>{item.name}</h3>
                <h4>₹{item.price}</h4>
                <p> {item.size}</p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button onClick={() => handleDecrease(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item)}>+</button>
                </div>

                <button onClick={() => handleDelete(item)}>Remove</button>
              </div>
            ))}

            <Paper
              style={{
                padding: "20px",
                marginTop: "20px",
                width: "300px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <p>Total Items: {cart.length}</p>
              <p>
                <b>Total Amount:</b> ₹{getTotal()}
              </p>
              <Button
                onClick={() => {
                  navigate("/payment", {
                    state: {
                      totalAmount: getTotal(),
                      cartItem: cart,
                    },
                  });
                }}
                sx={{
                  width: "250px",
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#000ccf",
                  color: "#fff",
                  borderRadius: "10px",
                  cursor: "pointer",

                  "&:hover": {
                    backgroundColor: "#0000ff",
                  },
                }}
              >
                Proceed To Pay
              </Button>
            </Paper>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
