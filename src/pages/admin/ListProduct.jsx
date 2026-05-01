import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../csspage/adminRouter.css";

const ListProduct = () => {
  const [product, setProduct] = useState([]);
  const [slideimg, setSlideimg] = useState({});
  const [editData, setEditData] = useState({});
  const [editId, setEditId] = useState(null);
  const [newImg, setNewImg] = useState({});

  const getProduct = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/get-product/get-product",
        {
          withCredentials: true,
        },
      );
      setProduct(res.data);
    } catch (error) {
      console.log({ message: error.message });
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

      await axios.put(
        `http://localhost:5000/get-product/update-product/${id}`,
        formData,
      );

      alert("Updated successfully");
      setEditId(null);
      getProduct();
    } catch (error) {
      console.log(error);
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
      await axios.delete(
        `http://localhost:5000/get-product/delete-product/${id}`,
      );
      alert("Delete Product Successfull");
      setProduct();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="product-page-list">
      <div className="product-container-list">
        {product &&
          product.map((item) => {
            const currentIndex = slideimg[item._id] || 0;
            const editing = editId === item._id;

            return (
              <div className="product-card-list" key={item._id}>
                {/* IMAGE SECTION */}
                {editing ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i}>
                        <img
                          src={
                            newImg[i]
                              ? URL.createObjectURL(newImg[i])
                              : editData.image?.[i]
                                ? `http://localhost:5000/uploads/${editData.image[i]}`
                                : "https://via.placeholder.com/70"
                          }
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "cover",
                            border: "1px solid #ccc",
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
                          style={{ display: "none" }}
                          onChange={(e) => handleImgChange(e, i)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div>
                      <img
                        src={`http://localhost:5000/uploads/${
                          item.image?.[currentIndex]
                        }`}
                        alt="main"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />

                      {/* MINI IMAGES */}
                      <div className="product-mini-img-list">
                        {item.image?.map((img, i) => (
                          <img
                            key={i}
                            src={`http://localhost:5000/uploads/${img}`}
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
                  <>
                    <input
                      name="productName"
                      value={editData.productName || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="price"
                      value={editData.price || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="description"
                      value={editData.description || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="gender"
                      value={editData.gender || ""}
                      onChange={handleChange}
                    />
                    <input
                      name="category"
                      value={editData.category || ""}
                      onChange={handleChange}
                    />

                    <button onClick={() => handleUpdate(item._id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h2>{item.productName}</h2>
                    <p>{item.price}</p>
                    <p>{item.description}</p>

                    <div>
                      {item.size?.length > 0 ? (
                        item.size.map((s) => `${s.size}:${s.stock}`).join(", ")
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
                          padding: "5px",
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
                          padding: "5px",
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
      </div>
    </div>
  );
};

export default ListProduct;
