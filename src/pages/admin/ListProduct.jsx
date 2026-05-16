import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../csspage/adminRouter.css";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ListProduct = () => {
  const [product, setProduct] = useState([]);

  const [slideimg, setSlideimg] = useState({});

  const [editData, setEditData] = useState({});

  const [editId, setEditId] = useState(null);

  const [newImg, setNewImg] = useState({});

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [type, setType] = useState("success");

  const showSnackbar = (msg, severity = "success") => {
    setMessage(msg);

    setType(severity);

    setOpen(true);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const getProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/get-product`, {
        withCredentials: true,
      });

      const productsData = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      setProduct(productsData);
    } catch (error) {
      console.log(error);

      setProduct([]);

      showSnackbar("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setEditData({
      productName: item.productName,
      price: item.price,
      description: item.description,
      gender: item.gender,
      category: item.category,
      size: item.size || [],
      image: item.image || [],
    });

    setNewImg({});

    showSnackbar("Edit mode enabled", "info");
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();

      formData.append("productName", editData.productName);

      formData.append("price", editData.price);

      formData.append("description", editData.description);

      formData.append("gender", editData.gender);

      formData.append("category", editData.category);

      formData.append("size", JSON.stringify(editData.size));

      formData.append("oldImages", JSON.stringify(editData.image));

      Object.keys(newImg).forEach((key) => {
        formData.append("image", newImg[key]);

        formData.append("index", key);
      });

      await axios.put(`${API_URL}/get-product/update-product/${id}`, formData);

      showSnackbar("Updated successfully", "success");

      setEditId(null);

      getProduct();
    } catch (error) {
      console.log(error);

      showSnackbar("Update failed", "error");
    }
  };

  const handleImgChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    setNewImg((prev) => ({
      ...prev,
      [index]: file,
    }));
  };

  const handledelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/get-product/delete-product/${id}`);

      showSnackbar("Delete Product Successful", "success");

      getProduct();
    } catch (error) {
      console.log(error);

      showSnackbar("Delete failed", "error");
    }
  };

  return (
    <>
      <div className="product-page-list">
        <div className="product-container-list">
          {loading &&
            Array.from(new Array(6)).map((_, index) => (
              <div className="product-card-list" key={index}>
                <Box>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={220}
                    animation="wave"
                    sx={{
                      borderRadius: "10px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {Array.from(new Array(4)).map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        width={50}
                        height={50}
                        animation="wave"
                      />
                    ))}
                  </div>

                  <Skeleton
                    width="80%"
                    height={40}
                    animation="wave"
                    sx={{
                      marginTop: "15px",
                    }}
                  />

                  <Skeleton width="40%" height={30} animation="wave" />

                  <Skeleton width="90%" height={25} animation="wave" />

                  <Skeleton width="70%" height={25} animation="wave" />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={40}
                      animation="wave"
                    />

                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={40}
                      animation="wave"
                    />
                  </div>
                </Box>
              </div>
            ))}

          {!loading &&
            product.map((item) => {
              const currentIndex = slideimg[item._id] || 0;

              const editing = editId === item._id;

              return (
                <div className="product-card-list" key={item._id}>
                  {/* IMAGE SECTION */}

                  {editing ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: "20px",
                      }}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i}>
                          <img
                            src={
                              newImg[i]
                                ? URL.createObjectURL(newImg[i])
                                : editData.image?.[i]
                                  ? `${API_URL}/uploads/${editData.image[i]}`
                                  : "https://via.placeholder.com/70"
                            }
                            alt=""
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              border: "1px solid #ccc",
                              borderRadius: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document
                                .getElementById(`file-${item._id}-${i}`)
                                .click()
                            }
                          />

                          <input
                            id={`file-${item._id}-${i}`}
                            type="file"
                            style={{
                              display: "none",
                            }}
                            onChange={(e) => handleImgChange(e, i)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div>
                        <img
                          src={`${API_URL}/uploads/${item.image?.[currentIndex]}`}
                          alt="main"
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />

                        <div className="product-mini-img-list">
                          {item.image?.map((img, i) => (
                            <img
                              key={i}
                              src={`${API_URL}/uploads/${img}`}
                              alt=""
                              onClick={() =>
                                setSlideimg((prev) => ({
                                  ...prev,
                                  [item._id]: i,
                                }))
                              }
                              style={{
                                cursor: "pointer",

                                border:
                                  (slideimg[item._id] || 0) === i
                                    ? "2px solid #ccc"
                                    : "none",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* TEXT SECTION */}

                  {editing ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <TextField
                        label="Product Name"
                        name="productName"
                        value={editData.productName || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />

                      <TextField
                        label="Price"
                        name="price"
                        value={editData.price || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />

                      <TextField
                        label="Description"
                        name="description"
                        value={editData.description || ""}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        size="small"
                        fullWidth
                      />

                      <TextField
                        label="Gender"
                        name="gender"
                        value={editData.gender || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />

                      <TextField
                        label="Category"
                        name="category"
                        value={editData.category || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                      />

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mt: 1,
                        }}
                      >
                        <button
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#16a34a",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() => handleUpdate(item._id)}
                        >
                          Save
                        </button>

                        <button
                          style={{
                            flex: 1,
                            padding: "10px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#dc2626",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <h2>{item.productName}</h2>

                      <p>₹{item.price}</p>

                      <p>{item.description}</p>

                      <div>
                        {item.size?.length > 0 ? (
                          item.size
                            .map((s) => `${s.size}:${s.stock}`)
                            .join(", ")
                        ) : (
                          <p>No sizes available</p>
                        )}
                      </div>

                      <p>{item.gender}</p>

                      <p>{item.category}</p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "5px 10px",
                        }}
                      >
                        <button
                          style={{
                            border: "none",
                            borderRadius: 5,
                            backgroundColor: "#0000ff",
                            color: "#fff",
                            padding: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEdit(item)}
                        >
                          Update Product
                        </button>

                        <button
                          style={{
                            border: "none",
                            borderRadius: 5,
                            backgroundColor: "#df0020",
                            color: "#fff",
                            padding: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() => handledelete(item._id)}
                        >
                          Remove Product
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

          {!loading && product.length === 0 && (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                padding: "40px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              No Products Found
            </div>
          )}
        </div>
      </div>

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
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ListProduct;
