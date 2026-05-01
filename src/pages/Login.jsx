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

import { InputAdornment, IconButton } from "@mui/material";
import { GrFormViewHide, GrFormView } from "react-icons/gr";

const Login = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [password, setPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", form, {
        withCredentials: true,
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage(res.data.message);
      setType("success");
      setOpen(true);

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/adminrouter");
        } else {
          navigate("/product");
        }
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setType("error");
      setOpen(true);
    }
  };
  const handleTogglePassword = () => {
    setPassword(!password);
  };
  return (
    <Box
      sx={{
        height: "89vh",
        width: "100%",
        backgroundImage: `url(${loginimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            width: 350,
            p: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "#00000063",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" textAlign="center" sx={{ color: "#fff" }}>
            Login
          </Typography>

          <TextField
            label="Username (Email)"
            name="email"
            fullWidth
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
            label="Password"
            name="password"
            type={password ? "text" : "password"}
            fullWidth
            onChange={handleChange}
            sx={{
              input: { color: "#fff" },
              label: { color: "rgb(221, 221, 221)" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={handleTogglePassword}
                    sx={{ color: "#ccc" }}
                  >
                    {password ? <GrFormView /> : <GrFormViewHide />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              onClick={() => navigate("/register")}
              sx={{
                cursor: "pointer",
                color: "#E6C9A8",
              }}
            >
              Register
            </Typography>
          </Box>

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#E6C9A8",
              color: "#000",
            }}
          >
            Login
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
  );
};

export default Login;
