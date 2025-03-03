import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Trash2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const EditPromotionProductList = ({ promotionId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const token = sessionStorage.getItem("token");

  // ✅ โหลดข้อมูลสินค้าในโปรโมชั่นเดิม
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/promotions/${promotionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productsFromPromotion = response.data.items.map((item) => ({
          productId: item.productId._id,
          name: item.productId.itemDescription,
          price: item.productId.price || 0,
          quantity: item.quantity,
          images: item.productId.images,
        }));

        setSelectedProducts(productsFromPromotion);
      } catch (error) {
        console.error("❌ โหลดข้อมูลสินค้าในโปรโมชั่นล้มเหลว:", error);
      }
    };

    fetchPromotion();
  }, [promotionId, token]);

  // ✅ ค้นหาสินค้า
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/newproducts/search?keyword=${encodeURIComponent(searchQuery)}`
        );
        setSuggestions(response.data.products || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ เพิ่มสินค้าใหม่เข้ารายการ
  const addProduct = async (product) => {
    const existingProduct = selectedProducts.find((p) => p.productId === product._id);

    let updatedProducts;
    if (existingProduct) {
      updatedProducts = selectedProducts.map((p) =>
        p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      updatedProducts = [
        ...selectedProducts,
        {
          productId: product._id,
          name: product.itemDescription,
          price: product.price || 0,
          quantity: 1,
          images: product.images,
        },
      ];
    }

    setSelectedProducts(updatedProducts);

    try {
      await axios.post(
        `${BASE_URL}/api/promotions/${promotionId}`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("❌ เพิ่มสินค้าไปยังโปรโมชั่นล้มเหลว:", error);
    }
  };


// ✅ ลบสินค้า
const removeProduct = async (productId) => {
  try {
    // เปลี่ยน endpoint เป็น /api/promotions/:promotionId/remove-product
    // และส่งเฉพาะ { productId } ใน body
    await axios.put(
      `${BASE_URL}/api/promotions/${promotionId}/remove-product`,
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // อัปเดต State ในฝั่ง Client
    const updatedProducts = selectedProducts.filter((p) => p.productId !== productId);
    setSelectedProducts(updatedProducts);
  } catch (error) {
    console.error("❌ ลบสินค้าออกจากโปรโมชั่นล้มเหลว:", error);
  }
};


  // ✅ แก้ไขจำนวนสินค้า
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return;

    const updatedProducts = selectedProducts.map((p) =>
      p.productId === productId ? { ...p, quantity } : p
    );
    setSelectedProducts(updatedProducts);

    try {
      await axios.put(
        `${BASE_URL}/api/promotions/${promotionId}`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("❌ อัปเดตจำนวนสินค้าในโปรโมชั่นล้มเหลว:", error);
    }
  };

  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  return (
    <div className="container mx-auto p-4 w-full">
  {/* 🔎 ค้นหาสินค้า */}
  <div className="relative flex items-center gap-2 border rounded-lg p-2 bg-white shadow">
    <input
      type="text"
      placeholder="🔍 ค้นหาสินค้า..."
      className="flex-grow h-12 text-xl sm:text-base pl-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* ✅ Responsive Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
    {/* ✅ แสดงรายการสินค้าที่ค้นหา (ฝั่งซ้าย) */}
    <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {suggestions.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white w-full"
        >
          {/* ✅ ตรวจสอบว่ามีรูปภาพหรือไม่ */}
          {product.images && product.images.length > 0 ? (
            <img
              src={`${BASE_URL}/uploads/products/${product.images[0].fileName}`}
              alt={product.itemDescription || "ไม่มีชื่อสินค้า"}
              className="w-32 h-32 object-cover rounded-md border mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no-image.png"; // fallback ถ้าภาพโหลดไม่ได้
              }}
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center border bg-gray-200 text-gray-500 text-sm rounded-md mb-2">
              ไม่มีรูปสินค้า
            </div>
          )}

          <span className="text-base font-medium text-gray-900 text-center w-full truncate max-w-[180px] mb-1">
            {product.itemDescription || "ไม่มีชื่อสินค้า"}
          </span>
          <p className="text-base text-gray-600 mb-2">
            ราคา: {product.price?.toLocaleString() || 0} ฿
          </p>
          <button
            className="mt-auto bg-green-600 text-white w-full sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition duration-200 text-xs sm:text-sm md:text-base"
            onClick={() => addProduct(product)}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-center">เพิ่มสินค้า</span>
          </button>
        </div>
      ))}
    </div>

    {/* 📦 รายการสินค้าที่เลือก (ฝั่งขวา) */}
    <div className="md:col-span-2 lg:col-span-1 border rounded-lg shadow-lg p-5 bg-white w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        📌 รายการที่เลือก
      </h3>
      <div className="max-h-96 overflow-auto space-y-3">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product.productId}
              className="flex items-center bg-gray-100 p-3 rounded-lg shadow w-full"
            >
              {/* ✅ ตรวจสอบรูปสินค้า */}
              {product.images && product.images.length > 0 ? (
                <img
                  src={`${BASE_URL}/uploads/products/${product.images[0].fileName}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.png";
                  }}
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center border bg-gray-200 text-gray-500 text-xs rounded-md">
                  ไม่มีรูปสินค้า
                </div>
              )}

              <span className="text-sm font-medium text-gray-900 flex-grow px-2 truncate max-w-[180px]">
                {product.name}
              </span>
              <span className="text-sm text-gray-600 px-2">
                {product.price.toLocaleString()} ฿
              </span>
              <input
                type="number"
                className="w-12 border text-center mx-2 rounded-lg"
                value={product.quantity}
                onChange={(e) =>
                  updateQuantity(product.productId, Number(e.target.value))
                }
                min="1"
              />
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => removeProduct(product.productId)}
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">ยังไม่มีสินค้าที่เลือก</p>
        )}
      </div>

      {/* 💰 แสดงราคารวม */}
      <div className="mt-4 text-right border-t pt-3">
        <h4 className="text-lg font-semibold text-gray-800">
          ราคารวม:{" "}
          <span className="text-blue-600">
            {totalPrice.toLocaleString()} ฿
          </span>
        </h4>
      </div>
    </div>
  </div>
</div>

  
  );
};

export default EditPromotionProductList;
