import { useState, useEffect } from "react";
import { Repeat } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ProductCard({ product = {} }) {
  const navigate = useNavigate();
  const [imageStatus, setImageStatus] = useState("loading");

  // ✅ เช็คก่อนว่า product มีค่าหรือไม่
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="p-4 bg-gray-100 text-gray-500 rounded-lg shadow-md text-center">
        ไม่มีข้อมูลสินค้า
      </div>
    );
  }

  const hasImage = product?.images?.length > 0 && product.images[0]?.fileName;
  const imageUrl = hasImage
    ? `${BASE_URL}/uploads/products/${product.images[0].fileName}`
    : null;

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (hasImage) {
      const timer = setTimeout(() => {
        if (imageStatus === "loading") setImageStatus("error");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasImage, imageStatus]);

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click event
    let selectedProducts = JSON.parse(sessionStorage.getItem("selectedProducts") || "[]");
    if (!selectedProducts.find((p) => p._id === product._id)) {
      selectedProducts.push(product);
      sessionStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    }
    navigate("/compare");
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="relative p-4 shadow-lg rounded-2xl bg-white border border-gray-200
        w-full sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[420px] 
        h-[540px] sm:h-[500px] md:h-[520px] lg:h-[590px] xl:h-[560px]
        flex flex-col justify-between cursor-pointer hover:shadow-2xl 
        transition-all duration-300"
    >
      {/* ✅ แบรนด์สินค้า + แท็ก ICT */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium truncate max-w-[70%]">
          {product.brand || "ไม่ระบุแบรนด์"}
        </p>

        {product.specICT && (
          <span
            className="bg-green-200 text-green-700 font-bold text-sm 
              px-3 py-1 rounded-lg border border-green-500 shadow-md"
          >
            ICT
          </span>
        )}
      </div>

      {/* ✅ รูปสินค้า */}
      <div className="w-full h-[220px] sm:h-[240px] md:h-[250px] lg:h-[260px] 
        flex justify-center items-center rounded-lg overflow-hidden bg-gray-50 border 
        border-gray-100 mb-4"
      >
        {hasImage && imageStatus !== "error" ? (
          <img
            src={imageUrl}
            alt={product.itemDescription || "ไม่มีชื่อสินค้า"}
            className="max-w-full max-h-full object-contain
              transition-transform duration-300 ease-in-out
              hover:scale-120"
            onLoad={() => setImageStatus("loaded")}
            onError={() => setImageStatus("error")}
          />
        ) : (
          <p className="text-center text-gray-400 italic">
            {hasImage ? "ไม่พบรูปสินค้า" : "ไม่มีรูปสินค้า"}
          </p>
        )}
      </div>

      {/* ✅ ชื่อสินค้า */}
      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-start line-clamp-3 px-2 mb-6">
        {product.itemDescription || "ไม่มีชื่อสินค้า"}
      </p>

      {/* ✅ ราคาสินค้า */}
      {token ? (
        <p className="text-base sm:text-xl md:text-2xl font-bold text-green-600 text-start mb-6 px-4">
          {product.price != null
            ? `${product.price.toLocaleString()} บาท`
            : "ไม่ระบุราคา"}
        </p>
      ) : (
        <div className="flex justify-center items-center mb-6">
          <Link
            to="/loginPage" 
            className="text-blue-500 font-semibold px-6 py-2 transition-all duration-200
              hover:text-green-600 hover:scale-105"
          >
            เข้าสู่ระบบเพื่อดูราคา
          </Link>
        </div>
      )}

      {/* ✅ ปุ่มเปรียบเทียบ */}
      <button
        className="w-full flex items-center justify-center gap-2 
          border-t border-gray-300 text-gray-600 font-medium text-base py-2
          rounded-b-xl hover:bg-gray-100 hover:shadow-inner transition-all duration-200"
        onClick={handleCompareClick}
      >
        <Repeat size={20} strokeWidth={1.5} />
        <span>เปรียบเทียบ</span>
      </button>
    </div>
  );
}

// ✅ ตรวจสอบ props
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    brand: PropTypes.string,
    itemDescription: PropTypes.string,
    price: PropTypes.number,
    specICT: PropTypes.bool,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
      })
    ),
  }),
};
