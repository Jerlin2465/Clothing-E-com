import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../../csspage/adminRouter.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSidebar, setOpenSidebar] = useState(false);

  const menuItems = [
    {
      name: "Admin Panel",
      path: "/adminrouter/adminpanel",
    },
    {
      name: "ListProduct",
      path: "/adminrouter/listproduct",
    },
    {
      name: "OrderList",
      path: "/adminrouter/orderlist",
    },{
      name:"Banner",
      path:"/adminrouter/addbanner"
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setOpenSidebar(false);
  };

  return (
    <div className="admin-container">
      {/* Mobile Menu Button */}
      <button className="menu-btn" onClick={() => setOpenSidebar(!openSidebar)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${openSidebar ? "open" : ""}`}>
        {menuItems.map((item) => (
          <p
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={location.pathname === item.path ? "active" : ""}
          >
            {item.name}
          </p>
        ))}
      </div>

      {/* Overlay */}
      {openSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      {/* Outlet */}
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
