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

import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
    color: "#000",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
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

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/Myaccount");
        }}
      >
        My account
      </MenuItem>

      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate("/Login");
        }}
      >
        Login
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
        <Toolbar id="navbar">
          {/* LOGO */}
          <Typography
            variant="h6"
            noWrap
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Jerry
          </Typography>

          {/* SEARCH */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" />
          </Search>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 8,
              alignItems: "center",
              justifyContent: "end",
              mr: 3,
            }}
          >
            <Typography
              onClick={() => navigate("/")}
              sx={{
                p: 1,
                borderRadius: 50,
                "&:hover": { backgroundColor: "#000" },
              }}
            >
              Home
            </Typography>
            <Typography
              onClick={() => navigate("/product")}
              sx={{
                p: 1,
                borderRadius: 50,
                "&:hover": { backgroundColor: "#000" },
              }}
            >
              Product
            </Typography>
            <Typography
              onClick={() =>
                document
                  .querySelector(".about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              sx={{
                p: 1,
                borderRadius: 50,
                "&:hover": { backgroundColor: "#000" },
              }}
            >
              About
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            <IconButton color="inherit">
              <Badge
                badgeContent={0}
                color="error"
                onClick={() => navigate("/cart")}
                sx={{
                  mr: 2,
                  p: 2,
                  borderRadius: 50,
                  "&:hover": { backgroundColor: "#000", color: "#fff" },
                }}
              >
                <ImCart />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => navigate("/wishli")}
              sx={{
                mr: 2,
                p: "0 15px 0 15px",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "#000", color: "#fff" },
              }}
            >
              <FaRegHeart />
            </IconButton>

            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                mr: 2,
                p: 2,
                borderRadius: 50,
                "&:hover": { backgroundColor: "#000", color: "#fff" },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>

          {/* MOBILE / TABLET USER ICON (REPLACED 3 DOTS) */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMenu}
    </Box>
  );
}
