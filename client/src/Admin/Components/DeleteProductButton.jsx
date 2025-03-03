import axios from "axios";
import Swal from "sweetalert2";

export default function DeleteProductButton({ productId }) {
  const handleDelete = async () => {
    if (!productId) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ID สินค้าไม่ถูกต้อง!",
      });
      return;
    }

    // Confirm ก่อนลบ
    const confirmDelete = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "สินค้านี้จะถูกลบออกจากระบบถาวร!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token"); // ดึง Token สำหรับ Authentication
      const response = await axios.delete(`http://localhost:3000/api/newProducts/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ส่ง Token ไปให้ Backend
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ลบสินค้าเรียบร้อย!",
          text: "สินค้าถูกลบออกจากระบบแล้ว",
          timer: 1500, // ให้แสดง 1.5 วินาที
          showConfirmButton: false
        }).then(() => {
          window.location.reload(); // ✅ รีเฟรชหน้า
        });
      } else {
        throw new Error("ลบสินค้าไม่สำเร็จ");
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: error.response?.data?.message || "ไม่สามารถลบสินค้าได้!",
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      title="ลบโปรโมชั่น"
    >
      🗑️ ลบ
    </button>
  );
}
