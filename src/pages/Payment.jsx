import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const totalAmount = Number(location.state?.totalAmount ?? 0);
  const cartItem = location.state?.cartItem || [];

  // ================= SNACKBAR =================

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [type, setType] = useState("success");

  const [loading, setLoading] = useState(false);

  const showSnackbar = (msg, severity = "success") => {
    setMessage(msg);

    setType(severity);

    setOpen(true);
  };

  // ================= SESSION CHECK =================

  if (!location.state || totalAmount <= 0 || cartItem.length === 0) {
    return (
      <>
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

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            severity={type}
            variant="filled"
            onClose={() => setOpen(false)}
          >
            {message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // ================= PAYMENT =================

  const handlePayment = async () => {
    try {
      setLoading(true);

      // CREATE ORDER

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

        description: "Order Payment",

        order_id: data.id,

        handler: async function (response) {
          try {
            // ================= VERIFY PAYMENT =================

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

            console.log("VERIFY RESPONSE:", verify.data);

            if (!verify.data.success) {
              showSnackbar("Payment verification failed", "error");

              return;
            }

            // ================= PLACE ORDER =================

            const orderData = {
              userId: user?.id || user?._id,

              email: user?.email,

              name: user?.name,

              products: cartItem.map((item) => ({
                productId: item.productId?._id || item.productId,

                size: item.size,

                quantity: item.quantity,
              })),

              totalAmount,

              paymentStatus: "Paid",
            };

            console.log("ORDER DATA:", orderData);

            const orderRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/order/place-order`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            console.log("ORDER RESPONSE:", orderRes.data);

            if (orderRes.data.success) {
              // ================= CLEAR CART =================

              try {
                const clearRes = await axios.delete(
                  `${import.meta.env.VITE_API_URL}/cart/clear`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                console.log("CART CLEAR:", clearRes.data);
              } catch (err) {
                console.log(
                  "Cart clear error:",
                  err.response?.data || err.message,
                );
              }

              // ================= SHOW SUCCESS =================

              showSnackbar("Order placed successfully", "success");

              // WAIT FOR SNACKBAR

              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              showSnackbar(orderRes.data.message || "Order failed", "warning");
            }
          } catch (err) {
            console.log(
              "PAYMENT HANDLER ERROR:",
              err.response?.data || err.message,
            );

            showSnackbar("Something went wrong", "error");
          }
        },

        modal: {
          ondismiss: () => {
            showSnackbar("Payment cancelled", "warning");
          },
        },

        theme: {
          color: "#0000ff",
        },
      };

      const razor = new window.Razorpay(options);

      razor.open();

      razor.on("payment.failed", function (response) {
        console.log(response.error);

        showSnackbar("Payment failed", "error");
      });
    } catch (err) {
      console.log("PAYMENT ERROR:", err.response?.data || err.message);

      showSnackbar("Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          minHeight: "100vh",

          background: "linear-gradient(to right, #dbeafe, #bfdbfe)",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: "350px",

            padding: "30px",

            borderRadius: "15px",

            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,

              fontWeight: "bold",
            }}
          >
            Payment
          </Typography>

          <Typography
            sx={{
              fontSize: "20px",

              mb: 2,
            }}
          >
            Total Amount
          </Typography>

          <Typography
            sx={{
              fontSize: "32px",

              fontWeight: "bold",

              color: "#0000ff",
            }}
          >
            ₹ {totalAmount.toLocaleString("en-IN")}
          </Typography>

          <Button
            onClick={handlePayment}
            disabled={loading}
            sx={{
              mt: 4,

              width: "100%",

              padding: "12px",

              backgroundColor: "#0000ff",

              color: "#fff",

              borderRadius: "10px",

              fontSize: "16px",

              "&:hover": {
                backgroundColor: "#000",
              },
            }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </Paper>
      </Box>

      {/* ================= SNACKBAR ================= */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={type}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{
            width: "100%",

            fontSize: "15px",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaymentForm;
