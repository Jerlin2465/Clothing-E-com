import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  useMediaQuery,
  Button,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // ================= GET ORDERS =================

  const getOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/order/all-orders`);

      const data = res.data.orders || [];

      setOrders(data);

      setRows(flattenOrders(data));
    } catch (error) {
      console.log("ORDER FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FLATTEN DATA =================

  const flattenOrders = (orders) => {
    const result = [];

    for (const order of orders) {
      for (const item of order.products || []) {
        result.push({
          orderId: order._id,

          userId: order.userId?._id || "-",

          userName: order.userId?.name || order.userId?.fullname || "-",

          productId: item.productId?._id || "",

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

  // ================= FILTER =================

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

  // ================= STATS =================

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const paidCount = orders.filter((o) => o.paymentStatus === "Paid").length;

  // ================= USER INITIALS =================

  const initials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 1.5 : 3,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",

          alignItems: isMobile ? "flex-start" : "center",

          justifyContent: "space-between",

          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Orders
        </Typography>

        <Chip
          label={`${orders.length} Orders`}
          sx={{
            background: "#E6F1FB",
            color: "#185FA5",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* ================= STATS ================= */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Total Orders",
            value: orders.length,
          },

          {
            label: "Revenue",
            value: `₹ ${totalRevenue.toLocaleString("en-IN")}`,
          },

          {
            label: "Paid",
            value: paidCount,
          },

          {
            label: "Pending",
            value: orders.length - paidCount,
          },
        ].map((item) => (
          <Grid item xs={6} md={3} key={item.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #eee",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>

              <Typography variant="h6" fontWeight={700} mt={1}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ================= SEARCH ================= */}

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",

          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, product, order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
          displayEmpty
          size="small"
          sx={{
            minWidth: isMobile ? "100%" : 180,
          }}
        >
          <MenuItem value="">All Payments</MenuItem>

          <MenuItem value="Paid">Paid</MenuItem>

          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </Box>

      {/* ================= TABLE ================= */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid #eee",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <Table
            sx={{
              minWidth: 1500,
              whiteSpace: "nowrap",
            }}
          >
            {/* ================= TABLE HEAD ================= */}

            <TableHead>
              <TableRow
                sx={{
                  background: "#fafafa",
                }}
              >
                {[
                  "Order ID",
                  "User ID",
                  "User Name",
                  "Product Name",
                  "Size",
                  "Quantity",
                  "Total Amount",
                  "Payment",
                  "Date",
                  "View",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: 700,
                      fontSize: "12px",
                      color: "#777",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* ================= TABLE BODY ================= */}

            <TableBody>
              {/* LOADING */}

              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                /* NO DATA */

                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                /* REAL DATA */

                filtered.map((r, i) => (
                  <TableRow key={i}>
                    {/* ORDER ID */}

                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.orderId}
                    </TableCell>

                    {/* USER ID */}

                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.userId}
                    </TableCell>

                    {/* USER */}

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: 12,
                            bgcolor: "#E6F1FB",
                            color: "#185FA5",
                            fontWeight: 700,
                          }}
                        >
                          {initials(r.userName)}
                        </Avatar>

                        <Typography
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.userName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* PRODUCT */}

                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.productName}
                    </TableCell>

                    {/* SIZE */}

                    <TableCell>{r.size}</TableCell>

                    {/* QUANTITY */}

                    <TableCell>{r.quantity}</TableCell>

                    {/* AMOUNT */}

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹ {r.totalAmount.toLocaleString("en-IN")}
                    </TableCell>

                    {/* PAYMENT */}

                    <TableCell>
                      <Chip
                        label={r.paymentStatus}
                        size="small"
                        sx={{
                          background:
                            r.paymentStatus === "Paid" ? "#EAF3DE" : "#FAEEDA",

                          color:
                            r.paymentStatus === "Paid" ? "#3B6D11" : "#854F0B",

                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    {/* DATE */}

                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.date}
                    </TableCell>

                    {/* VIEW BUTTON */}

                    <TableCell>
                      <Button
                        onClick={() => navigate(`/product/${r.productId}`)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        <FaEye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderList;
