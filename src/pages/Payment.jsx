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
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/order`,
        {
          amount: totalAmount,
        },
      );

      const options = {
        key: import.meta.env.VITE_RAZOR_PAYMENT_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Shop",
        order_id: data.id,

        handler: async function (response) {
          try {
            // VERIFY PAYMENT
            const verify = await axios.post(
              `${import.meta.env.VITE_API_URL}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                totalAmount,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!verify.data.success) {
              alert("Payment verification failed");
              return;
            }

            // 🟢 PLACE ORDER (IMPORTANT FIX: email + name added)
            const orderData = {
              userId: user?.id || user?._id,
              email: user?.email, // 🔥 REQUIRED FOR EMAIL
              name: user?.name, // 🔥 REQUIRED FOR EMAIL

              products: cartItem.map((item) => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
              })),

              totalAmount,
              paymentStatus: "Paid",
            };

            const orderRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/order/place-order`,
              orderData,
            );

            if (orderRes.data.success) {
              // CLEAR CART
              try {
                await axios.delete(
                  `${import.meta.env.VITE_API_URL}/cart/clear`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
              } catch (err) {
                console.log("Cart clear error:", err.message);
              }

              alert("Order placed successfully 🎉 Email sent!");
              navigate("/");
            } else {
              alert(orderRes.data.message);
            }
          } catch (err) {
            console.log(err);
            alert("Something went wrong");
          }
        },

        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
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
