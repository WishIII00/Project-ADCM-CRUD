// src/pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ProductFilter from "../Component/ProductFilter";
import ProductCard from "./ProductCard2"; // ใช้ไฟล์ที่คุณมีอยู่แล้ว
import ChatButton from "../Component/ChatButton";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);        // ✅ เก็บข้อมูลสินค้า
  const [loading, setLoading] = useState(true);        // ✅ สถานะโหลดข้อมูล

  // 📦 ดึงข้อมูลสินค้าจาก API
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/products/filter", { params: filters });
      setProducts(data.products);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลสินค้าได้:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();  // ✅ โหลดสินค้าทั้งหมดเมื่อเปิดหน้า
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* 🎛️ Sidebar ฟิลเตอร์ */}
      <div className="lg:col-span-1">
        <ProductFilter onFilter={fetchProducts} />
      </div>

      {/* 🛒 รายการสินค้า */}
      <div className="lg:col-span-3">
        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลดสินค้า...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500">ไม่มีสินค้าตรงกับเงื่อนไข</p>
        )}
      </div>
      <ChatButton/>
    </div>
  );
};

export default ProductListPage;
