import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Component/ProductCard"; // ✅ นำเข้า ProductCard
import ChatButton from "../Component/ChatButton";

const PromotionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/promotions/${id}`
        );
        setPromotion(response.data || null);

        // ✅ ตรวจสอบข้อมูลสินค้าภายในโปรโมชั่น
        console.log("🚀 Promotion Items:", response.data?.items);
      } catch (error) {
        console.error("🚫 ไม่สามารถโหลดข้อมูลโปรโมชั่น:", error);
        setPromotion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
    setToken(sessionStorage.getItem("token"));
  }, [id]);

  if (loading) return <div className="text-center mt-10">กำลังโหลด...</div>;
  if (!promotion) return <div className="text-center mt-10 text-red-500">ไม่พบโปรโมชั่น</div>;

  return (
    <div className="w-full bg-gray-50 py-8 px-4 md:px-12">
      {/* ✅ ส่วนแสดงโปรโมชั่น */}
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ✅ รูปภาพโปรโมชั่น */}
          <div className="w-full flex justify-center bg-gray-100">
            {promotion.poster ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/promotion/${promotion.poster}`}
                alt={promotion.name || "โปรโมชั่น"}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                ไม่มีรูปภาพโปรโมชั่น
              </div>
            )}
          </div>

          {/* ✅ รายละเอียดโปรโมชั่น */}
          <div className="p-6 flex flex-col justify-between">
            <h1 className="text-4xl font-bold text-gray-800">
              {promotion.name || "ไม่มีชื่อโปรโมชั่น"}
            </h1>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                รายการสินค้าในโปรโมชั่น
              </h2>
              {promotion.items?.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg list-inside">
                  {promotion.items.map((item, index) => (
                    <li key={item.productId?._id || index} className="truncate">
                      {item.productId?.itemDescription || "ไม่มีรายละเอียดสินค้า"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">ไม่มีรายการสินค้าในโปรโมชั่นนี้</p>
              )}
            </div>

            {/* ✅ แสดงราคา หรือให้เข้าสู่ระบบ */}
            {token ? (
              <p className="text-green-600 font-bold text-4xl mt-6">
                ฿{promotion.price?.toLocaleString() ?? "N/A"}
              </p>
            ) : (
              <button
                onClick={() => navigate("/loginPage")}
                className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 transition mt-6 text-lg"
              >
                เข้าสู่ระบบเพื่อดูราคา
              </button>
            )}

            {/* ✅ ปุ่ม ขอใบเสนอราคา (ไปที่ LINE) */}
            <div className="mt-6">
              <a
                href="https://line.me/R/ti/p/@021nijcx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-4 text-white text-lg font-semibold rounded-lg 
                  bg-gradient-to-r from-green-500 to-green-700 shadow-md 
                  hover:scale-105 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                📄ขอใบเสนอ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ส่วนแสดงรายการสินค้าในโปรโมชั่น (เลื่อนในแนวนอน) */}
      <div className="max-w-full mx-auto mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          สินค้าที่ร่วมโปรโมชั่น
        </h2>

        <div className="flex overflow-x-auto space-x-4 p-4">
          {promotion.items?.length > 0 ? (
            promotion.items
              .filter(item => item.productId) // ✅ กรองเฉพาะสินค้าที่มีค่า productId
              .map((item, index) => (
                <div key={item.productId?._id || index} className="flex-shrink-0">
                  <ProductCard product={item.productId} />
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              ไม่มีสินค้าในโปรโมชั่นนี้
            </p>
          )}
        </div>
      </div>
      <ChatButton />
    </div>
  );
};

export default PromotionPage;
