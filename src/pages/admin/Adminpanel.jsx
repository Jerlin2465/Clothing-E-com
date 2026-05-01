import { Box, Button, TextField, Typography } from "@mui/material";
import img from "../../assets/download-img.png";
import { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Adminpanel = () => {
  const navigate = useNavigate();
  const fill = useRef(null);

  const [product, setProduct] = useState({
    productName: "",
    price: "",
    description: "",
    gender: "",
    category: "",
  });

  const [image, setImage] = useState([]);
  const [size, setSize] = useState([{ size: "", stock: "" }]);

  const handleClick = () => {
    fill.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + image.length > 4) {
      alert("You can upload only 4 images");
      return;
    }
    setImage((prev) => [...prev, ...files]);
  };

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handelSizeChange = (index, field, value) => {
    const update = [...size];
    update[index][field] = value;
    setSize(update);
  };

  const handleRemove = (index) => {
    const update = size.filter((_, i) => i !== index);
    setSize(update);
  };

  const handleAdd = () => {
    setSize([...size, { size: "", stock: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("gender", product.gender);
    formData.append("category", product.category);
    image.forEach((image) => {
      formData.append("image", image);
    });

    formData.append("size", JSON.stringify(size));
    try {
      const res = await axios.post(
        "http://localhost:5000/get-product/upload",
        formData,
        { withCredentials: true },
      );
      console.log(res.data);
      alert("Product Added Successfully");
      setProduct({
        productName: "",
        price: "",
        description: "",
        gender: "",
        category: "",
      });
      setImage([]);
      setSize([""]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        ref={fill}
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            width: 420,
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" textAlign="center" fontWeight="bold">
            Add Product
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {[0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                component="img"
                src={image[i] ? URL.createObjectURL(image[i]) : img}
                onClick={handleClick}
                sx={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              />
            ))}
          </Box>

          <TextField
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Product Price"
            name="price"
            value={product.price}
            type="number"
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Product Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Gender"
            name="gender"
            value={product.gender}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            name="category"
            value={product.category}
            onChange={handleChange}
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Category</option>
            <option value="shirt">Shirt</option>
            <option value="pant">Pant</option>
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
          </TextField>

          <Box>
            <Typography mb={1}>Select Size</Typography>

            {size.map((s, index) => (
              <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="Size"
                  value={s.size}
                  onChange={(e) =>
                    handelSizeChange(index, "size", e.target.value)
                  }
                />

                <TextField
                  size="small"
                  label="Stock"
                  type="number"
                  value={s.stock}
                  onChange={(e) =>
                    handelSizeChange(index, "stock", e.target.value)
                  }
                />

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemove(index)}
                >
                  X
                </Button>
              </Box>
            ))}

            <Button variant="contained" onClick={handleAdd}>
              Add Size
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#1a237e",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0d1642",
              },
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Adminpanel;
