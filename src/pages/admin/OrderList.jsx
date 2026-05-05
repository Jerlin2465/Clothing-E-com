import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order/all-orders`);
      const data = res.data.orders || [];
      setOrders(data);
      setRows(flattenOrders(data));
    } catch (error) {
      console.log("ORDER FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const flattenOrders = (orders) => {
    const result = [];
    for (const order of orders) {
      for (const item of order.products || []) {
        result.push({
          orderId: order._id,
          userId: order.userId?._id || "-",
          userName: order.userId?.name || order.userId?.fullname || "-",
          productName: item.productId?.productName || "-",
          size: item.size || "-",
          quantity: item.quantity,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
        });
      }
    }
    return result;
  };

  useEffect(() => {
    getOrders();
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      r.orderId.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q);
    const matchP = !payFilter || r.paymentStatus === payFilter;
    return matchQ && matchP;
  });

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const paidCount = orders.filter((o) => o.paymentStatus === "Paid").length;

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: "22px" }}>Order </h2>
        <span
          style={{
            background: "#E6F1FB",
            color: "#185FA5",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "13px",
          }}
        >
          {orders.length} orders
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "Total Orders", value: orders.length },
          {
            label: "Total Revenue",
            value: `₹ ${totalRevenue.toLocaleString("en-IN")}`,
          },
          { label: "Paid", value: paidCount },
          { label: "Pending", value: orders.length - paidCount },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#f5f5f5",
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by name, product, order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
        <select
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
          style={{
            padding: "9px 14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {[
                "Order ID",
                "User ID",
                "User Name",
                "Product Name",
                "Size",
                "Qty",
                "Total Amount",
                "Payment",
                "Date",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 12px",
                    textAlign: "left",
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#999",
                  }}
                >
                  Loading orders...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#999",
                  }}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td
                    style={{
                      padding: "11px 12px",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      color: "#999",
                    }}
                    title={r.orderId}
                  >
                    ...{r.orderId.slice(-8)}
                  </td>
                  <td
                    style={{
                      padding: "11px 12px",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      color: "#999",
                    }}
                    title={r.userId}
                  >
                    ...{r.userId.slice(-6)}
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#E6F1FB",
                          color: "#185FA5",
                          fontSize: "11px",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {initials(r.userName)}
                      </div>
                      {r.userName}
                    </div>
                  </td>
                  <td style={{ padding: "11px 12px" }}>{r.productName}</td>
                  <td style={{ padding: "11px 12px" }}>{r.size}</td>
                  <td style={{ padding: "11px 12px" }}>{r.quantity}</td>
                  <td style={{ padding: "11px 12px", fontWeight: 600 }}>
                    ₹ {r.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <span
                      style={{
                        background:
                          r.paymentStatus === "Paid" ? "#EAF3DE" : "#FAEEDA",
                        color:
                          r.paymentStatus === "Paid" ? "#3B6D11" : "#854F0B",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "11px 12px", color: "#888" }}>
                    {r.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
