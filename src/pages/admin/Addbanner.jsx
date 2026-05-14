import React, { useEffect, useState } from "react";
import axios from "axios";
import bannerImg from "../../assets/download-img.png";

const Addbanner = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState([]);

  const [editId, setEditId] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://clothing-backend-volk.onrender.com";

  const getBanners = async () => {
    try {
      const res = await axios.get(`${API_URL}/banner/all`);

      setBanners(res.data.banners || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        const res = await axios.put(
          `${API_URL}/banner/update/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        alert(res.data.message);
      } else {
        const res = await axios.post(`${API_URL}/banner/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert(res.data.message);
      }

      // RESET
      setTitle("");
      setImage(null);
      setPreview("");
      setEditId(null);

      getBanners();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure want to delete this banner?",
      );

      if (!confirmDelete) return;

      const res = await axios.delete(`${API_URL}/banner/delete/${id}`);

      alert(res.data.message);

      getBanners();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (banner) => {
    setTitle(banner.title || "");

    setPreview(`${API_URL.replace("/api", "")}/uploads/${banner.image}`);

    setEditId(banner._id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "30px",
        fontFamily: "sans-serif",
      }}
    >
      {/* ================= FORM ================= */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "auto",
          background: "#fff",
          borderRadius: "15px",
          padding: "30px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          {editId ? "Edit Banner" : "Add Banner"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Banner Title
            </label>

            <input
              type="text"
              placeholder="Enter Banner Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
          </div>

          {/* IMAGE */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Banner Image
            </label>

            <label
              htmlFor="bannerUpload"
              style={{
                cursor: "pointer",
                display: "block",
              }}
            >
              <img
                src={preview || bannerImg}
                alt="banner"
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </label>

            <input
              id="bannerUpload"
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#111827",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Uploading..." : editId ? "Update Banner" : "Add Banner"}
          </button>
        </form>
      </div>

      <div
        style={{
          marginTop: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner._id}
            style={{
              background: "#fff",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={`${API_URL.replace("/api", "")}/uploads/${banner.image}`}
              alt="banner"
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "15px" }}>
              <h3>{banner.title}</h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => handleEdit(banner)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(banner._id)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#dc2626",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addbanner;
