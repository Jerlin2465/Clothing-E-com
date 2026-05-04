import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../csspage/adminRouter.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <div className="sidebar">
        <p onClick={() => navigate("/adminrouter/adminpanel")}>Admin Panel</p>
        <p onClick={() => navigate("/adminrouter/listproduct")}>ListProduct</p>
        <p onClick={() => navigate("/adminrouter/orderlist")}>OrderList</p>
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
