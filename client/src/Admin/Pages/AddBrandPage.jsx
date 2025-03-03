import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Layouts/AdminLayout";

const API_BASE_URL = "http://localhost:3000/api"; // 🔥 เปลี่ยน URL ให้ตรงกับ Backend จริง

const AddBrandPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]); // 🔥 เก็บรายชื่อแบรนด์

  // 📌 โหลดแบรนด์ทั้งหมดจาก Backend
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brands`);
      setBrands(response.data.brands);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands(); // โหลดแบรนด์เมื่อเข้าเพจ
  }, []);

  // 📌 ฟังก์ชันเพิ่มแบรนด์
  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });
    }

    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการเพิ่มแบรนด์นี้เข้าสู่ระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เพิ่มเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/brands`,
        { name: data.name },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({ title: "สำเร็จ!", text: "เพิ่มแบรนด์เรียบร้อย", icon: "success" });
      reset();
      fetchBrands();
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: error.response?.data?.message || "ไม่สามารถเพิ่มแบรนด์ได้",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 📌 ฟังก์ชันลบแบรนด์
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });
    }

    const confirm = await Swal.fire({
      title: "ต้องการลบแบรนด์หรือไม่?",
      text: "เมื่อลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/brands/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      Swal.fire({ title: "ลบสำเร็จ!", text: "แบรนด์ถูกลบเรียบร้อย", icon: "success" });
      fetchBrands();
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: error.response?.data?.message || "ไม่สามารถลบแบรนด์ได้",
        icon: "error",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">เพิ่มแบรนด์สินค้า</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">ชื่อแบรนด์</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="กรอกชื่อแบรนด์สินค้า"
              {...register("name", { required: "กรุณากรอกชื่อแบรนด์" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "เพิ่มแบรนด์"}
          </button>
        </form>
      </div>

      {/* 🔥 แสดงตารางแบรนด์ */}
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-2">รายการแบรนด์</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ชื่อแบรนด์</th>
              <th className="border p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="text-center">
                <td className="border p-2">{brand.name}</td>
                <td className="border p-2">
                  <Link to={`/edit-brand/${brand._id}`} className="text-blue-600 mr-3">แก้ไข</Link>
                  <button onClick={() => handleDelete(brand._id)} className="text-red-600">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AddBrandPage;
