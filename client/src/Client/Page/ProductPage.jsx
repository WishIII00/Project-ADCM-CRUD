// ✅ นำเข้า Dependencies ที่ใช้ในหน้า ProductPage

import { useEffect, useState } from "react"; // ใช้จัดการ State และ Lifecycle
import { useParams, useNavigate } from "react-router-dom"; // ดึงพารามิเตอร์จาก URL และใช้ navigate
import axios from "axios"; // สำหรับเรียก API
import { ChevronLeft, ChevronRight, FileText, Repeat, Share } from "lucide-react"; // ไอคอนสำหรับ UI
import Lightbox from "yet-another-react-lightbox"; // ไลบรารีสำหรับดูภาพแบบเต็มจอ
import "yet-another-react-lightbox/styles.css"; // สไตล์ของ Lightbox
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"; // ปลั๊กอินสำหรับแสดงรูปย่อ
import "yet-another-react-lightbox/plugins/thumbnails.css"; // สไตล์ของรูปย่อ
import ChatButton from "../Component/ChatButton";

// ✅ URL พื้นฐานของ API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ✅ ฟังก์ชันแปลง cscode เป็นชื่อเต็มของประเภทสินค้า
const getFullCategoryName = (cscode) => {
  const categoryMap = {
    AORR: "NOTEBOOK PERSONAL COMPUTER (AORR)",
    NW01: "NETWORK SWITCH (NW01)",
    IOT02: "SMART SENSOR DEVICE (IOT02)",
    SC05: "SOLAR PANEL (SC05)",
  };
  return categoryMap[cscode] || cscode || "ไม่ระบุ"; // คืนค่า cscode เดิมถ้าไม่พบใน Map
};

const ProductPage = () => {
  const { id } = useParams(); // ✅ ดึง id จาก URL
  const navigate = useNavigate(); // ✅ ใช้สำหรับนำทาง
  const [product, setProduct] = useState(null); // ✅ State สำหรับเก็บข้อมูลสินค้า
  const [loading, setLoading] = useState(true); // ✅ จัดการสถานะโหลด
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ จัดการ index รูปภาพ
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // ✅ จัดการสถานะ Lightbox
  const token = sessionStorage.getItem("token"); // ✅ ตรวจสอบ token

  // ✅ ดึงข้อมูลสินค้าจาก API
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/newProducts/${id}`);
      setProduct(response.data); // บันทึกข้อมูลสินค้า
      setCurrentIndex(0); // รีเซ็ต index รูปภาพ
    } catch (error) {
      console.error(
        "🚫 ไม่สามารถดึงข้อมูลสินค้า:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // ปิดโหลด
    }
  };

  useEffect(() => {
    if (id) fetchProduct(); // โหลดข้อมูลเมื่อ id เปลี่ยน
  }, [id]);

  // ✅ ข้อความระหว่างโหลด
  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-medium">กำลังโหลด...</div>
    );
  }

  // ✅ ถ้าไม่พบสินค้า
  if (!product) {
    return (
      <div className="text-center py-10 text-lg font-medium text-red-500">
        ไม่พบข้อมูลสินค้า
      </div>
    );
  }

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click event
    let selectedProducts = JSON.parse(
      sessionStorage.getItem("selectedProducts") || "[]"
    );
    if (!selectedProducts.find((p) => p._id === product._id)) {
      selectedProducts.push(product);
      sessionStorage.setItem(
        "selectedProducts",
        JSON.stringify(selectedProducts)
      );
    }
    navigate("/compare");
  };

  // ✅ สร้าง array รูปภาพ
  const images =
    product.images?.map((img) => ({
      src: `${BASE_URL}/uploads/products/${img.fileName}`,
      alt: product.itemDescription,
    })) || [];

  // ✅ ฟังก์ชันเลื่อนรูป
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const fullCategoryName = getFullCategoryName(product.cscode); // ✅ แปลง cscode
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ ส่วนที่ 1: รูปภาพ + ข้อมูลสินค้า */}
      <div className="w-full max-w-auto mx-auto p-4 sm:p-6 md:p-8 lg:p-14 bg-white">
        {/* ✅ ส่วนที่ 1: รูปภาพ + ข้อมูลสินค้า */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start pb-8 border-b border-gray-300 relative">
          {/* ✅ รูปภาพสินค้า */}
          <div className="relative flex flex-col items-center w-full space-y-6">
            <div className="relative w-full">
              {images.length > 1 && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-gray-200 transition z-10"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <div className="relative w-full h-[460px] bg-gray-100 rounded-2xl flex justify-center items-center overflow-hidden shadow-md">
                {images.length > 0 ? (
                  <img
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className="w-full h-full object-contain cursor-pointer rounded-lg"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                ) : (
                  <p className="text-gray-500">ไม่มีรูปภาพสินค้า</p>
                )}
              </div>

              {images.length > 1 && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow hover:bg-gray-200 transition z-10"
                  onClick={handleNext}
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* ✅ แถบรูปภาพย่อ */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center w-full overflow-x-auto p-3 rounded-lg bg-gray-50">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img.src}
                    alt={`รูปที่ ${index + 1}`}
                    className={`w-20 h-20 rounded-lg object-cover cursor-pointer border-2 transition-transform duration-150 hover:scale-110 ${
                      currentIndex === index
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ✅ ข้อมูลสินค้า */}
          <div className="space-y-6 w-full text-left">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              {product.itemDescription}
            </h1>

            <ul className="list-disc pl-16 space-y-5 text-gray-800 text-lg">
              <li>
                <span className="font-semibold">ยี่ห้อ:</span>{" "}
                {product.brand || "N/A"}
              </li>
              <li>
                <span className="font-semibold">รหัสสินค้า:</span>{" "}
                {product.itemNumber || "N/A"}
              </li>
              <li>
                <span className="font-semibold">หมวดหมู่:</span>{" "}
                {product.category || "N/A"}
              </li>
              <li>
                <span className="font-semibold">ประเภทสินค้า:</span>{" "}
                {fullCategoryName || "N/A"}
              </li>
              <li>
                <span className="font-semibold">มาตรฐาน ICT:</span>{" "}
                <span
                  className={`text-gray-700 ${
                    product.specICT
                      ? "text-green-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {product.specICT ? "รองรับ" : "ไม่รองรับ"}
                </span>
              </li>
              <li>
                <span className="font-semibold">สถานะสินค้า:</span>{" "}
                <span className="text-green-600 font-semibold">
                  {product.status || "N/A"}
                </span>
              </li>
            </ul>

            {/* ✅ ราคา (ตรวจสอบ token ก่อนแสดง) */}
            {token ? (
              <p className="text-green-600 font-bold text-4xl mt-10 pl-4">
                ราคา :{" "}
                {product.price != null
                  ? ` ${product.price.toLocaleString()} บาท`
                  : "฿N/A"}
              </p>
            ) : (
              <button
                onClick={() => navigate("/loginPage")}
                className="w-full py-4 mt-10 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition"
              >
                เข้าระบบเพื่อดูราคา
              </button>
            )}

            {/* ✅ ปุ่มควบคุม (แสดงตลอด) */}
            <div className="w-full flex flex-col gap-4 mt-6">
              {/* ✅ ปุ่มรับใบเสนอราคา (เปิด LINE ทันที) */}
              <button
                onClick={() => {
                  window.open("https://line.me/R/ti/p/@021nijcx", "_blank");
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-md 
    hover:scale-105 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-2 text-xl"
              >
                <FileText size={28} /> รับใบเสนอราคา
              </button>

              {/* ✅ ปุ่มเปรียบเทียบ & แชร์ */}
              <div className="w-full flex gap-4">
                <button
                  onClick={handleCompareClick} // ✅ เพิ่มฟังก์ชันเปรียบเทียบ
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition flex justify-center items-center gap-2 text-xl"
                >
                  <Repeat size={30} strokeWidth={1.5} />
                  <span>เปรียบเทียบ</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("✅ ลิงก์ถูกคัดลอกแล้ว!");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition flex justify-center items-center gap-2"
                >
                  <Share  size={30} ></Share> แชร์
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ✅ คุณสมบัติสินค้า */}
        <div className="w-full mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            คุณสมบัติสินค้า
          </h2>
          <div className="w-full border-t border-gray-300"></div>
          <table className="w-full mt-4 text-left text-gray-800">
            <tbody>
              {product.specifications?.map((spec, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-5 py-3 font-semibold w-1/3">{spec.name}</td>
                  <td className="px-5 py-3">{spec.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Lightbox */}
        {isLightboxOpen && (
          <Lightbox
            open={isLightboxOpen}
            close={() => setIsLightboxOpen(false)}
            slides={images.map((img) => ({ src: img.src }))}
            index={currentIndex}
            plugins={[Thumbnails]}
            styles={{
              container: {
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(15px)",
              },
              thumbnailsContainer: { backgroundColor: "#f1f1f1" },
            }}
            thumbnails={{
              position: "bottom",
              width: 100,
              height: 70,
              borderRadius: 8,
              gap: 8,
            }}
          />
        )}
      </div>
      <ChatButton />
    </div>
  );
};

export default ProductPage;
