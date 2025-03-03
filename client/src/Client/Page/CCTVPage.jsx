import { useState, useEffect } from "react";
import axios from "axios";
import ProductFilter from "../Component/ProductFilter"; // เพิ่มฟิลเตอร์สำหรับกรอก
import ProductCard from "../Component/ProductCard"; // การ์ดสินค้า
import cctv from "../../assets/Image/cctv.png"; // รูปภาพประกอบ
import ChatButton from "../Component/ChatButton";

export default function CCTVPage() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    specICT: false,
    minPrice: 0,
    maxPrice: 99999,
  });
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // สถานะสำหรับเก็บจำนวนสินค้า

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/newProducts/filter`,
        {
          params: {
            category: "IOT",
            specICT: filters.specICT ? "true" : undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
          },
        }
      );
      
      // ตรวจสอบจำนวนสินค้าจาก products.length หรือใช้ totalCount ถ้ามี
      const productCount = response.data.products?.length || 0;
      setTotalCount(productCount); // อัปเดตจำนวนสินค้า
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(
        "❌ ดึงข้อมูลสินค้าไม่สำเร็จ:",
        error.response?.data || error.message
      );
      setTotalCount(0); // ถ้าเกิดข้อผิดพลาด ให้เป็น 0
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="py-10 bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* ✅ Header */}
      <div className="text-left mb-8">
        <img
          src={cctv}
          alt="CCTV Promotion"
          className="w-full h-auto mb-6 rounded-lg shadow-md"
        />
        <h1 className="text-3xl font-extrabold text-gray-800">
          รวมกล้องวงจรปิด ราคาดีที่สุด ครบทุกรูปแบบ
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base px-6">
          ในยุคปัจจุบัน{" "}
          <span className="text-red-500 font-bold">กล้องวงจรปิด (CCTV)</span>{" "}
          ถือเป็นอุปกรณ์สำคัญที่ช่วยเสริมสร้างความปลอดภัยให้กับบ้านหรือธุรกิจของคุณ
          ไม่ว่าคุณจะต้องการเฝ้าระวังทรัพย์สิน ป้องกันอุบัติเหตุ
          หรือเพิ่มความสบายใจในชีวิตประจำวัน
          การเลือกกล้องวงจรปิดที่เหมาะสมกับการใช้งานและงบประมาณเป็นสิ่งสำคัญ
        </p>
        <div className="w-full p-6 bg-white shadow-lg rounded-lg mb-10 mt-6 border border-gray-300">
          <h1 className="text-2xl font-semibold text-gray-700">
            <span className="font-bold">กล้องวงจรปิด (CCTV)</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">จำนวน {totalCount} รายการ</p> {/* แสดงจำนวนสินค้าจาก totalCount */}
        </div>
      </div>

      {/* ฟิลเตอร์ */}
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-1/4 xl:w-1/5">
          <ProductFilter onFilterChange={handleFilterChange} filters={filters} />
        </aside>

        {/* สินค้า */}
        <section className="w-full lg:w-3/4 xl:w-4/5">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-blue-500 font-medium text-lg animate-pulse">
                ⏳ กำลังโหลดสินค้า...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500 font-semibold text-lg">
                ไม่พบสินค้าตามเงื่อนไขที่เลือก
              </p>
            </div>
          )}
        </section>
      </div>
      <ChatButton />
    </div>
  );
}
