import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Component/ProductCard";
import Memuicon from "../../assets/Image/Menu.png";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const categories = [
  { id: "CCTV", name: "กล้องวงจรปิด", icon: "📷", path: "/cctv" },
  { id: "Solar", name: "แผงโซล่าเซลล์", icon: "☀️", path: "/solar-panel" },
  { id: "Network", name: "ระบบเน็ตเวิร์ค", icon: "🌐", path: "/network" },
];

export default function CategoryWithProductGrid() {
  const [randomProductsRow1, setRandomProductsRow1] = useState([]);
  const [randomProductsRow2, setRandomProductsRow2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/newProducts?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.products.sort(() => 0.5 - Math.random());
        setRandomProductsRow1(shuffled.slice(0, 4)); // ✅ สุ่มสินค้าแถวที่ 1
        setRandomProductsRow2(shuffled.slice(4, 8)); // ✅ สุ่มสินค้าแถวที่ 2
      })
      .catch((err) => console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id); // ✅ เปลี่ยนหมวดหมู่
    navigate(category.path); // ✅ นำทางไปยังเส้นทางที่กำหนด
  };

  return (
    <div className="bg-white py-10 w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-16">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 w-full">
        <div className="flex items-center gap-3">
          <img src={Memuicon} alt="New" className="w-10 h-10 sm:w-12 sm:h-12" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">รายการสินค้า</h2>
        </div>
      </div>

      {/* ✅ ปุ่มหมวดหมู่ */}
      <div className="flex justify-start flex-wrap gap-10 mb-10 w-full px-10">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2 rounded-full text-base sm:text-lg font-semibold shadow-sm flex items-center gap-2 transition-transform transform hover:scale-105 ${
              selectedCategory === category.id
                ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <span className="text-xl sm:text-2xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg py-10">กำลังโหลดสินค้า...</p>
      ) : randomProductsRow1.length === 0 ? (
        <p className="text-center text-red-500 text-lg py-10">ไม่พบสินค้าในหมวดนี้</p>
      ) : (
        <>
          {/* ✅ แถวที่ 1: สินค้าสุ่ม */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 w-full">
            {randomProductsRow1.map((product) => (
              <div
                key={product._id}
                className="w-full flex justify-center transform transition-transform duration-200 hover:-translate-y-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* ✅ แถวที่ 2: สินค้าสุ่ม */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
            {randomProductsRow2.map((product) => (
              <div
                key={product._id}
                className="w-full flex justify-center transform transition-transform duration-200 hover:-translate-y-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
