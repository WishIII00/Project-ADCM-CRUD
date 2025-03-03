import Swal from "sweetalert2";
import axios from "axios";

export default function DeletePromotion({ promotionId, fetchPromotions }) {
  const handleDelete = () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนโปรโมชั่นนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/promotions/${promotionId}`);
          Swal.fire("ลบแล้ว!", "โปรโมชั่นถูกลบเรียบร้อย", "success");
          fetchPromotions(); // รีโหลดข้อมูลโปรโมชั่นหลังจากลบ
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
        }
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      title="ลบโปรโมชั่น"
    >
      ลบโปรโมชั่น
    </button>
  );
}
