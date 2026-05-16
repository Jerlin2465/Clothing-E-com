import * as React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";

import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import { ImCart } from "react-icons/im";
import { FaRegHeart } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* ================= SEARCH ================= */

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  color: "#000",
  "&:hover": {
    backgroundColor: "#ebe7e7",
  },
  marginRight: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /* ================= PROFILE MENU ================= */

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/Myaccount");
        }}
      >
        My Account
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();

          if (user) {
            localStorage.removeItem("user");
            navigate("/myaccount");
            window.location.reload();
          } else {
            navigate("/Login");
          }
        }}
      >
        {user ? "Logout" : "Login"}
      </MenuItem>

      {user?.role === "admin" && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/adminRouter");
          }}
        >
          Admin
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#1a237e",
          color: "#fff",
          p: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* MOBILE MENU BUTTON */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={() => setOpenDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* LOGO */}
            <Typography
              variant="h4"
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/")}
            >
              Jerry
            </Typography>
          </Box>

          {/* SEARCH
          <Search
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>

            <StyledInputBase placeholder="Search…" />
          </Search> */}

          {/* DESKTOP MENU */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Home
            </Typography>

            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/product")}
            >
              Product
            </Typography>

            {/* CART */}
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={0} color="error">
                <ImCart />
              </Badge>
            </IconButton>

            {/* WISHLIST */}
            <IconButton color="inherit" onClick={() => navigate("/wishlist")}>
              <FaRegHeart />
            </IconButton>

            {/* PROFILE */}
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
          </Box>

          {/* MOBILE PROFILE */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER MENU */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            width: 150,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            backgroundColor: "#1a237e",
            color: "#fff",
            padding: "10px",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Jerry
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
              setOpenDrawer(false);
            }}
          >
            Home
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/product");
              setOpenDrawer(false);
            }}
          >
            Product
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/wishlist");
              setOpenDrawer(false);
            }}
          >
            Wishlist
          </Typography>

          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/cart");
              setOpenDrawer(false);
            }}
          >
            Cart
          </Typography>
        </Box>
      </Drawer>

      {renderMenu}
    </Box>
  );
}
