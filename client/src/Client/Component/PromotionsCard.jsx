import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้สำหรับการนำทาง
import axios from "axios";
import PropTypes from "prop-types";

const PromotionsCard = ({ limit = 4 }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // ✅ ใช้สำหรับนำทางไปหน้าโปรโมชั่น

  // ✅ โหลดข้อมูลโปรโมชั่นจาก API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/promotions`);
        setPromotions(response.data.promotions.slice(0, limit));

        // ✅ ตรวจสอบข้อมูล API
        console.log("🚀 Promotions Data:", response.data.promotions);
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลโปรโมชั่น:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [limit]);

  // ✅ โหลด token จาก sessionStorage
  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">กำลังโหลดข้อมูล...</div>;
  }

  if (!promotions || promotions.length === 0) {
    return <div className="text-center mt-10 text-red-500">ไม่มีโปรโมชั่นในขณะนี้</div>;
  }

  return (
    <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {promotions.map((promotion) => (
          <div
            key={promotion._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg flex flex-col h-[600px] transition-transform transform hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate(`/promotions/${promotion._id}`)} // ✅ กดแล้วไปหน้า PromotionPage
          >
            {/* ✅ รูปภาพโปรโมชั่น */}
            <div className="p-2 flex justify-center items-center">
              {promotion.poster ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/promotion/${promotion.poster}`}
                  alt={promotion.name || "โปรโมชั่น"}
                  className="w-full h-72 object-cover rounded-xl shadow-sm"
                />
              ) : (
                <div className="w-full h-72 flex items-center justify-center bg-gray-200 rounded-xl text-gray-500">
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>

            {/* ✅ รายละเอียดโปรโมชั่น */}
            <div className="p-4 flex flex-col flex-grow">
              {/* ชื่อโปรโมชั่น */}
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-snug mb-2 truncate">
                {promotion.name || "ไม่มีชื่อโปรโมชั่น"}
              </h2>

              {/* รายการสินค้าในโปรโมชั่น */}
              <div className="flex-grow overflow-y-auto bg-gray-50 rounded-lg p-2">
                {Array.isArray(promotion.items) && promotion.items.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 max-h-44 overflow-y-auto text-sm sm:text-base">
                    {promotion.items
                      .filter((item) => item.productId) // ✅ กรองสินค้าที่ productId เป็น null ออก
                      .slice(0, 5)
                      .map((item) => (
                        <li key={item.productId._id} className="truncate text-gray-700">
                          {item.productId.itemDescription || "ไม่มีรายละเอียดสินค้า"}
                        </li>
                      ))}
                    {promotion.items.length > 5 && (
                      <li className="text-blue-500">...ดูเพิ่มเติม</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center">ไม่มีรายการสินค้าในโปรโมชั่นนี้</p>
                )}
              </div>

              {/* ✅ แสดงราคาโปรโมชั่น */}
              {token ? (
                <p className="text-green-600 text-lg sm:text-xl font-bold mt-3 text-center">
                  ฿{promotion.price ? promotion.price.toLocaleString() : "ไม่ระบุราคา"}
                </p>
              ) : (
                <div className="flex justify-center items-center mb-6">
                  <span className="text-red-500 font-semibold px-6 py-2">
                    เข้าสู่ระบบเพื่อดูราคา
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ ตรวจสอบ props ด้วย PropTypes
PromotionsCard.propTypes = {
  limit: PropTypes.number,
};

export default PromotionsCard;
