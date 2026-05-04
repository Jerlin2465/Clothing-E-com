import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const totalAmount = Number(location.state?.totalAmount ?? 0);
  const cartItem = location.state?.cartItem || [];

  if (!location.state || totalAmount <= 0 || cartItem.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <Typography>Session expired. Please go back to your cart.</Typography>
        <Button variant="contained" onClick={() => navigate("/cart")}>
          Back to Cart
        </Button>
      </Box>
    );
  }

  const handlePayment = async () => {
    try {
      console.log("Step 1 — totalAmount:", totalAmount);

      const { data } = await axios.post("http://localhost:5000/payment/order", {
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZOR_PAYMENT_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Shop",
        order_id: data.id,

        handler: async function (response) {
          try {
            console.log("Step 3 — verifying payment...");

            // Send totalAmount so paymentModel can save it
            const verify = await axios.post(
              "http://localhost:5000/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                totalAmount: totalAmount,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            console.log("Step 4 — verify result:", verify.data);

            if (!verify.data.success) {
              alert("Payment verification failed. Order not placed.");
              return;
            }

            //  Place order
            const orderData = {
              userId: user?.id || user?._id,
              products: cartItem.map((item) => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
              })),
              totalAmount: totalAmount,
              paymentStatus: "Paid",
            };

            console.log("Step 5 — placing order:", orderData);

            const orderRes = await axios.post(
              "http://localhost:5000/order/place-order",
              orderData,
            );

            if (orderRes.data.success) {
              //  Clear cart after order saved successfully
              try {
                await axios.delete("http://localhost:5000/cart/clear", {
                  headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Cart cleared");
              } catch (e) {
                console.log("Cart clear failed (non-critical):", e.message);
              }

              alert("🎉 Order placed successfully! Thank you for shopping.");
              navigate("/");
            } else {
              alert("Order failed: " + orderRes.data.message);
            }
          } catch (err) {
            const msg = err.response?.data?.message || err.message;
            console.error("Step ERROR:", err.response?.data || err.message);
            alert("Error: " + msg);
          }
        },

        modal: {
          ondismiss: () => console.log("Payment cancelled by user"),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment init error:", err.response?.data || err.message);
      alert("Could not start payment. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#aab",
      }}
    >
      <Paper
        sx={{
          width: "320px",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Payment
        </Typography>
        <Typography sx={{ fontSize: "20px", mb: 2 }}>Total Amount</Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
          ₹ {totalAmount.toLocaleString("en-IN")}
        </Typography>
        <Button
          onClick={handlePayment}
          sx={{
            mt: 4,
            width: "100%",
            padding: "12px",
            backgroundColor: "#0000ff",
            color: "#fff",
            borderRadius: "10px",
            "&:hover": { backgroundColor: "#000" },
          }}
        >
          Pay Now
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentForm;
