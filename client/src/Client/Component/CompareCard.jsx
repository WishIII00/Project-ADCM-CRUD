import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FilterSidebar from "../components/FilterSidebar";
import ComparisonTable from "../components/ComparisonTable";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [comparison, setComparison] = useState({});

  const searchParams = new URLSearchParams(location.search);
  const productIds = searchParams.getAll("product").slice(0, 3); // ✅ จำกัดไม่เกิน 3 สินค้า

  // ✅ โหลดข้อมูลสเปคสินค้า
  useEffect(() => {
    if (productIds.length > 0) {
      axios.post(`${BASE_URL}/api/newProducts/compareProducts`, {
        productId1: productIds[0],
        productId2: productIds[1],
        productId3: productIds[2] || null,
      })
      .then(({ data }) => setComparison(data))
      .catch((err) => console.error("❌ เปรียบเทียบสินค้าไม่สำเร็จ:", err));
    }
  }, [productIds]);

  // ✅ โหลดข้อมูลสินค้า
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          productIds.map((id) => axios.get(`${BASE_URL}/api/newProducts/${id}`))
        );
        setProducts(responses.map((res) => res.data));
      } catch (err) {
        console.error("❌ ดึงข้อมูลสินค้าล้มเหลว:", err);
      }
    };
    if (productIds.length > 0) fetchProducts();
  }, [productIds]);

  // ✅ ลบสินค้าออกจากการเปรียบเทียบ
  const handleRemoveProduct = (id) => {
    const updatedIds = productIds.filter((pid) => pid !== id);
    navigate(`/compare?${updatedIds.map((id) => `product=${id}`).join("&")}`);
  };

  return (
    <div className="flex gap-4 w-full p-6">
      {/* ✅ Sidebar ตัวกรอง */}
      <FilterSidebar />

      {/* ✅ ตารางเปรียบเทียบสินค้า */}
      <div className="flex-1">
        {products.length > 0 ? (
          <ComparisonTable
            products={products}
            comparison={comparison}
            onRemoveProduct={handleRemoveProduct}
          />
        ) : (
          <p className="text-center text-gray-400 italic">ไม่มีสินค้าที่จะเปรียบเทียบ</p>
        )}
      </div>
    </div>
  );
}