import axios from "axios";
import { Alert, Box, Button, Paper, Snackbar, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL 

const Myaccount = () => {
  const [loginDetalis, setLoginDetalis] = useState(null);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("success");
  const [message, setMessage] = useState("");

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.get(`${API_URL}/api/getdetail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoginDetalis(res.data.user);
    } catch (error) {
      console.log("getUser error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setMessage("Logged out successfully");
      setType("success");
      setOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      setMessage("Logout failed");
      setType("error");
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        backgroundColor: "#c2bfbf",
      }}
    >
      <Paper
        sx={{
          width: 350,
          p: 4,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          backgroundColor: "#e6e1e1",
        }}
      >
        {loginDetalis ? (
          <>
            <Typography variant="h4" fontWeight="bold">
              My Account
            </Typography>
            <Typography>Name : {loginDetalis?.fullname}</Typography>
            <Typography>Email : {loginDetalis?.email}</Typography>
            <Typography>Phone : {loginDetalis?.phoneNumber}</Typography>
            <Button
              fullWidth
              sx={{ mt: 2, backgroundColor: red[700], color: "white" }}
              onClick={handleLogout}
            >
              LogOut
            </Button>
          </>
        ) : (
          <>
            <p>No Login Found</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
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

export default Myaccount;
