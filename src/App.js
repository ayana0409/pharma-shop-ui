import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Sidebar } from "./components/common";
import { HomePage, LoginPage } from "../src/pages";
import * as Admin from "./pages/admin";
import * as Supplier from "./pages/supplier";
import * as Shop from "./pages/shop/index";
import * as Headers from "./components/common/header";
import * as Cart from "./pages/cart"
import Breadcrumbs from "./components/ui/Breadcrumb";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSupplierRoute = location.pathname.startsWith("/supplier");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="App flex justify-center">
      <div className="bg-gray-50 rounded-lg pb-8 mx-auto min-h-screen max-w-7xl w-full">
      {isAdminRoute ? (
        <>
          <Headers.AdminHeader toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      ) : isSupplierRoute ? (
        <>
          <Headers.SupplierHeader toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      ) : (
        <>
          <Headers.ShopHeader toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}
      <Breadcrumbs path={`App ${location.pathname.replace(/\//g, " > ")}`}>
      <div>
            <ToastContainer position="bottom-right" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<Admin.AdminPage />} />
              <Route path="/admin/category" element={<Admin.CategoryPage />} />
              <Route path="/admin/product" element={<Admin.ProductPage />} />
              <Route
                path="/admin/product/addandupdate/:productId"
                element={<Admin.AddAndUpdateProductPage />}
              />
              <Route
                path="/admin/product/addandupdate"
                element={<Admin.AddAndUpdateProductPage />}
              />
              <Route
                path="/supplier/importlist"
                element={<Supplier.ImportList />}
              />
              <Route
                path="/supplier/importdetail"
                element={<Supplier.ImportDetail />}
              />
              <Route
                path="/supplier/importdetail/:importId"
                element={<Supplier.ImportDetail />}
              />
              <Route path="/products/:keyword" element={<Shop.ProductList />} />
              <Route
                path="/products/category/:categoryId"
                element={<Shop.ProductList />}
              />
              <Route
                path="/products/details/:productId"
                element={<Shop.ProductDetail />}
              />
              <Route path="/cart" element={<Cart.Cart/>}/>
            </Routes>
          </div>
      </Breadcrumbs>
      </div>
    </div>
  );
}

export default App;
