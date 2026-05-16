import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import loginimage from "../assets/login-img.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        form,
      );

      setMessage(res.data.message);
      setType("success");
      setOpen(true);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.message || error.message);
      setType("error");
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: 645,
          width: "100%",
          backgroundImage: `url(${loginimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt:10,
        }}
      >
        <form onSubmit={handleSubmit} sx={{ gap: 2 }}>
          <Box
            sx={{
              width: 350,
              p: 4,
              borderRadius: 3,
              backdropFilter: "blur(12px)",
              backgroundColor: "#00000063",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" textAlign="center" sx={{ color: "#fff" }}>
              Register
            </Typography>

            <TextField
              label="Full Name"
              name="fullname"
              fullWidth
              required
              onChange={handleChange}
              sx={{
                input: { color: "#fff" },
                label: { color: "rgb(221, 221, 221)" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
            />

            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              onChange={handleChange}
              sx={{
                input: { color: "#fff" },
                label: { color: "#ddd" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
            />

            <TextField
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              fullWidth
              required
              onChange={handleChange}
              sx={{
                input: { color: "#fff" },
                label: { color: "#ddd" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              required
              onChange={handleChange}
              sx={{
                input: { color: "#fff" },
                label: { color: "#ddd" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              name="confirmpassword"
              fullWidth
              required
              onChange={handleChange}
              sx={{
                input: { color: "#fff" },
                label: { color: "#ddd" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                },
              }}
            />

            <Typography
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{
                cursor: "pointer",
                color: "#E6C9A8",
                textAlign: "right",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Already have an account
            </Typography>

            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#E6C9A8",
                color: "#000",
                "&:hover": { backgroundColor: "#D2B48C" },
              }}
            >
              Register
            </Button>
          </Box>
        </form>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={type} variant="filled">
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Register;
