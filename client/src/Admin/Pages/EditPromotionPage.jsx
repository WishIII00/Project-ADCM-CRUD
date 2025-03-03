import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../Layouts/AdminLayout";
import Swal from "sweetalert2";
import EditPromotionProductList from "../Components/EditPromotionProductList";
import DeletePromotion from "../Components/DeletePromotion";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const EditPromotionPage = () => {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [promotionName, setPromotionName] = useState("");
  const [promotionPrice, setPromotionPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/promotions/${promotionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, price, poster } = response.data;
        setPromotionName(name);
        setPromotionPrice(price);
        setExistingImage(poster);
      } catch (error) {
        console.error("❌ โหลดข้อมูลโปรโมชั่นล้มเหลว:", error);
      }
    };

    fetchPromotion();
  }, [promotionId, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      Swal.fire("❌ กรุณาเลือกไฟล์รูปภาพเท่านั้น!");
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!promotionName.trim()) {
      Swal.fire("❌ กรุณากรอกชื่อโปรโมชั่น!");
      return;
    }

    const formData = new FormData();
    formData.append("name", promotionName);
    formData.append("price", promotionPrice);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${BASE_URL}/api/promotions/${promotionId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "✅ แก้ไขโปรโมชั่นสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => navigate("/admin/dashboard"));
    } catch (error) {
      console.error("❌ แก้ไขโปรโมชั่นล้มเหลว:", error);
      Swal.fire("❌ แก้ไขโปรโมชั่นไม่สำเร็จ", error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full mx-auto shadow-2xl bg-white rounded-lg overflow-hidden">
        {/* 🏷️ หัวข้อหลัก */}
        <h2 className="text-3xl font-bold text-center bg-blue-100 text-gray-800 py-6 w-full">
          🏷️ จัดเซตโปรโมชั่น
        </h2>

        {/* 🛒 รายการสินค้าในโปรโมชั่น */}
        <div className="px-8 py-6 w-full">
          <EditPromotionProductList promotionId={promotionId} />
        </div>

        {/* 📝 ฟอร์มแก้ไขโปรโมชั่น */}
        <form onSubmit={handleSubmit} className="w-full px-10 py-8 space-y-8 bg-white rounded shadow-lg">
          {/* ✅ ชื่อโปรโมชั่น */}
          <div className="w-full">
            <label className="font-semibold text-lg block mb-2">📝 ชื่อโปรโมชั่น</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-2 focus:ring-blue-500"
              placeholder="ใส่ชื่อโปรโมชั่น..."
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
              required
            />
          </div>

          {/* ✅ อัปโหลดรูปโปรโมชั่น */}
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4">📸 รูปโปรโมชั่น</h3>
            <div className="flex flex-col items-center gap-6 p-6 bg-gray-100 rounded-lg w-full">
              <label className="w-56 h-56 border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden hover:bg-blue-50 transition">
                {image ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="รูปใหม่"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : existingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={`${BASE_URL}/uploads/promotion/${existingImage}`}
                      alt="รูปเดิม"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-6xl text-blue-400 font-bold">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {image && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  ล้างรูปที่อัปโหลด
                </button>
              )}
            </div>
          </div>

          {/* ✅ ราคาของโปรโมชั่น */}
          <div className="w-full">
            <label className="font-semibold text-lg block mb-2">💵 ราคาของโปรโมชั่น</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-4 text-base focus:ring-2 focus:ring-blue-500"
              placeholder="ระบุราคาของโปรโมชั่น"
              value={promotionPrice}
              onChange={(e) => setPromotionPrice(e.target.value ? Number(e.target.value) : 0)}
              min="0"
              required
            />
          </div>

          {/* ✅ ปุ่มควบคุม */}
          <div className="flex justify-end gap-4 mt-8">
            {/* ✅ ปุ่มยกเลิก */}
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg font-semibold hover:bg-gray-500 transition"
            >
              ยกเลิก
            </button>

            {/* ✅ ปุ่มลบ */}
            <DeletePromotion
              promotionId={promotionId}
              className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition"
            >
              ลบสินค้า
            </DeletePromotion>

            {/* ✅ ปุ่มบันทึก */}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditPromotionPage;
