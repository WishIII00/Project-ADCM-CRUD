import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Client/Component/ProtectedRoute";
import CCTVPage from "./Client/Page/CCTVPage";
import Signup from "./Admin/Pages/signup";
import "./App.css";
import PromotionPage from "./Client/Page/PromotionsPage";
import Promotions from "./Client/Page/PromotionlistPage";
import About from "./Client/Page/AboutUs";


// 📄 Client Pages
import Home from "./Client/Page/Home";
import LoginPopup from "./Client/Component/Desktop/Login/Login";
import LoginPage from "./Client/Component/Desktop/Login/Loginpage";
import ProductPage from "./Client/Page/ProductPage";

// 📄 Admin Pages
import DashboardPage from "./Admin/Pages/DashboardPage";
import AddProductPage from "./Admin/Pages/AddProductPage";
import Addpromotion from "./Admin/Pages/AddPromotionPage";
import EditProductPage from "./Admin/Pages/EditProductPage";
import EditPromotionPage from "./Admin/Pages/EditPromotionPage";
import UserDashboard from "./Admin/Pages/UserDashboard"
import Contact from "./Client/Page/ContactPage";
import MainLayout from "./Client/Component/MainLayout";
import ComparePage from "./Client/Page/CompareProductsPage";
import EditUserPage from "./Admin/Pages/UserEditPage";
import Network from "./Client/Page/NetworkPage";
import Solar from "./Client/Page/SolarCellPage";
import AddBrandPage from "./Admin/Pages/AddBrandPage";
import EditBrandPage from "./Admin/Pages/EditBrandPage";
import AddCSCodePage from "./Admin/Pages/AddCSCodePage";
import EditCSCodePage from "./Admin/Pages/EditCSCodePage";



function App() {
  const [setIsOpen] = useState(false);

  return (
    <Router>
      <Routes>

        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login-popup" element={<LoginPopup setIsOpen={setIsOpen} />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
        <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cctv" element={<CCTVPage />} />
          <Route path="/network" element={<Network />} />
          <Route path="/promotion-set" element={<Promotions />} />
          <Route path="/solar-panel" element={<Solar />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/promotions/:id" element={<PromotionPage />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* ✅ Protected User Routes (ต้องมี token + role = "user") */}
        <Route element={<ProtectedRoute roleRequired="user" />}>
          <Route path="/home" element={<Home />} />
        </Route>

        {/* ✅ Protected Product Routes (ต้องมี token - ไม่จำกัด role) */}
        <Route element={<ProtectedRoute />}>
    
        </Route>

        {/* ✅ Protected Admin Routes (ต้องมี token + role = "admin") */}
        <Route element={<ProtectedRoute roleRequired="admin" />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/add-promotion" element={<Addpromotion />} />
          <Route path="/edit-product/:productId" element={<EditProductPage />} />
          <Route path="/edit-promotion/:promotionId" element={<EditPromotionPage />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/edit-user/:id" element={<EditUserPage />} /> {/* ✅ Route แก้ไข */}
          <Route path="/add-brand" element={<AddBrandPage />} />
          <Route path="/edit-brand/:id" element={<EditBrandPage />} />
          <Route path="/add-cscode" element={<AddCSCodePage />} />
          <Route path="/edit-cscode/:id" element={<EditCSCodePage />} />
          

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
