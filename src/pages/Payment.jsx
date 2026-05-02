import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import img from "../assets/payment.jpg";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const totalAmount = location.state?.totalAmount;

  const cartItem = location.state?.cartItem;

  const handlePayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/payment/order", {
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZOR_PAYMENT_ID,

        amount: data.amount,

        currency: data.currency,

        name: "jerry",

        description: "Shopping Payment",

        order_id: data.id,

        handler: async function (response) {
          try {
            const verifyData = await axios.post(
              "http://localhost:5000/payment/verify",
              {
                ...response,
                amount: totalAmount,
                products: cartItem,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verifyData.data.success) {
              alert("Payment Successful");

              navigate("/success");
            } else {
              alert("Payment Failed");
            }
          } catch (error) {
            console.log(error);
          }
        },

        prefill: {
          name: "Jerry",
          email: "abc@gmail.com",
          contact: "9876543210",
        },

        theme: {
          color: "#0000ff",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.log(error);
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
          background: " #aab",

          // backgroundImage: `url(${img})`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
        }}
      >
        <Paper
          sx={{
            width: "300px",
            padding: "20px",
            borderRadius: "10px",
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
          <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
            ₹ {totalAmount}
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

              "&:hover": {
                backgroundColor: "#000",
              },
            }}
          >
            Pay
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default PaymentForm;
