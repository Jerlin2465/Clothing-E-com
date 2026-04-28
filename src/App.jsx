import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./components/Home";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Wishlist from "./pages/Wishlist";
import Myaccount from "./pages/Myaccount";
import AdminRouter from "./pages/admin/AdminRouter";
import Adminpanel from "./pages/admin/Adminpanel";
import ListProduct from "./pages/admin/ListProduct";
import AdminLayout from "./pages/admin/AdminRouter";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product" element={<Product />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/myaccount" element={<Myaccount />} />
        <Route
          path="/adminrouter"
          element={
            <AdminRouter>
              <AdminLayout />
            </AdminRouter>
          }
        >
          <Route path="adminpanel" element={<Adminpanel />} />
          <Route path="listproduct" element={<ListProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
