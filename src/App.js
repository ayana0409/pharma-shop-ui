import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import { Sidebar } from "./components/common";
import { HomePage, LoginPage } from "../src/pages";
import * as Admin from "./pages/admin";
import * as Supplier from "./pages/supplier";
import * as Headers from "./components/common/header";
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
    <div className="App">
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
        <div className="px-4 pb-4">
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
          </Routes>
        </div>
      </Breadcrumbs>
    </div>
  );
}

export default App;
