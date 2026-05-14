import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
// import homeImg2 from "../assets/homeimg-2.png";
import homeImg2 from "../assets/hoodi.jpg";
import banner from "../assets/banner.jpg";
import banner3 from "../assets/hoodi-2.jpg";
import { IoIosArrowUp } from "react-icons/io";
import HomeProducts from "./home/HomeProducts";
import Banner from "../pages/Banner";

const Home = () => {
  const [category, setCategory] = useState("");
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCategory = (value) => {
    if (value === "all") {
      setCategory("");
    } else {
      setCategory(value);
    }
  };

  return (
    <>
      <Banner />

      <Box sx={{ backgroundColor: "rgb(193, 193, 205)", p: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            width: { xs: "95%", md: "90%" },
            mx: "auto",
            minHeight: { xs: 400, md: 600 },
            borderRadius: 5,
            boxShadow: 4,

            p: 2,
            background: "linear-gradient(to right, #777, #cac2c2)",
          }}
        >
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src={homeImg2}
              sx={{
                width: { xs: "80%", md: "90%" },
                maxWidth: 500,
                objectFit: "contain",
                borderRadius: 6,
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              p: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: 28, sm: 36, md: 48 },
              }}
            >
              Your style, your story.
              <br /> Wear it beautifully.
            </Typography>

            <Typography sx={{ mt: 3, fontSize: { xs: 14, md: 18 } }}>
              Style starts here. Trends you'll love. Looks that stand out.
              Confidence in every outfit.
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* CATEGORY TEXT */}
      <Box sx={{ backgroundColor: "#e3dede", mt: 2, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {["all", "shirt", "pant", "T-shirt"].map((item) => (
            <Typography
              key={item}
              onClick={() => handleCategory(item)}
              sx={{
                px: 1,
                py: 1,
                fontSize: 16,
                cursor: "pointer",
                borderRadius: 10,
                backgroundColor:
                  category === (item === "all" ? "" : item)
                    ? "#000"
                    : "transparent",
                color:
                  category === (item === "all" ? "" : item) ? "#fff" : "#000",
                "&:hover": { backgroundColor: "#CCC", color: "#000" },
              }}
            >
              {item.toUpperCase()}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* PRODUCTS */}
      <HomeProducts category={category} />
      {/* BANNER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "95%", md: "90%" },
          mx: "auto",
          mt: 3,
          p: 3,
          borderRadius: 4,
          background: "#d3cfcf",
          gap: 3,
        }}
      >
        <Box
          component="img"
          src={banner}
          sx={{
            width: { xs: "100%", md: "35%" },
            borderRadius: 3,
            boxShadow: 3,
            animation: "slideIn 1s ease forwards",
            "@keyframes slideIn": {
              "0%": { transform: "translateX(-100px)", opacity: 0 },
              "100%": { transform: "translateX(0)", opacity: 1 },
            },
          }}
        />

        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: 24, md: 40 }, fontWeight: "bold" }}
          >
            Limited-Time Offer
          </Typography>

          <Typography sx={{ fontSize: { xs: 14, md: 18 }, mt: 2 }}>
            Upgrade your style with unbeatable prices. Exclusive discounts on
            premium collections.
          </Typography>
        </Box>
      </Box>

      <HomeProducts />

      {/* ABOUT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: "center",
          width: { xs: "95%", md: "90%" },
          mx: "auto",
          mt: 3,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(to right, #d3cfcf, #e1d8d8)",
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h3"
            sx={{ fontSize: { xs: 24, md: 40 }, fontWeight: "bold" }}
          >
            About Our Dress Collection
          </Typography>

          <Typography sx={{ fontSize: { xs: 14, md: 18 }, mt: 2 }}>
            At Jerry Dress, fashion is expression. Our collection blends
            elegance and modern trends with premium quality fabrics.
          </Typography>
        </Box>

        <Box
          component="img"
          src={banner3}
          sx={{
            width: { xs: "80%", md: "30%" },
            borderRadius: 3,
            boxShadow: 3,
            animation: "slideRight 1s ease forwards",
            "@keyframes slideRight": {
              "0%": { transform: "translateX(100px)", opacity: 0 },
              "100%": { transform: "translateX(0)", opacity: 1 },
            },
          }}
        />
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          background: "#1a237e",
          color: "#e3e6f0",
          mt: 3,
          py: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-around",
            textAlign: "center",
            gap: 3,
          }}
        >
          <Typography variant="h4">Jerry</Typography>

          <Box>
            <Typography variant="h5">Help</Typography>
            <Typography>Contact Us</Typography>
            <Typography>About</Typography>
          </Box>

          <Box>
            <Typography variant="h5">Social</Typography>
            <Typography>Facebook</Typography>
            <Typography>YouTube</Typography>
            <Typography>Instagram</Typography>
          </Box>
        </Box>

        <Typography sx={{ textAlign: "center", fontSize: 14 }}>
          By Design
        </Typography>
      </Box>

      {/* SCROLL TOP BUTTON */}
      {scroll && (
        <Box
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            backgroundColor: "#1a237e",
            color: "#fff",
            borderRadius: "50%",
            p: 2,
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <IoIosArrowUp size={20} />
        </Box>
      )}
    </>
  );
};

export default Home;
