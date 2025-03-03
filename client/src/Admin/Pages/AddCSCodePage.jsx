import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Layouts/AdminLayout";

const API_BASE_URL = "http://localhost:3000/api";

const AddCSCodePage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [csCodes, setCSCodes] = useState([]);
  const navigate = useNavigate();

  // 📌 โหลดข้อมูล CSCode ทั้งหมด
  useEffect(() => {
    fetchCSCodes();
  }, []);

  const fetchCSCodes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cscodes`);
      setCSCodes(response.data.CSCodes);
    } catch (error) {
      console.error("❌ Error loading CSCode:", error);
      Swal.fire({ title: "เกิดข้อผิดพลาด!", text: "ไม่สามารถโหลดข้อมูล CSCode ได้", icon: "error" });
    }
  };

  // 📌 ฟังก์ชันเพิ่ม CSCode
  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });
    }

    const trimmedCode = data.code.trim();
    if (!trimmedCode) {
      return Swal.fire({ title: "เกิดข้อผิดพลาด!", text: "กรุณากรอก CSCode", icon: "error" });
    }

    // ✅ ตรวจสอบก่อนว่ามี CSCode นี้อยู่แล้วหรือไม่
    if (csCodes.some(cs => cs.code === trimmedCode)) {
      return Swal.fire({ title: "เกิดข้อผิดพลาด!", text: "CSCode นี้มีอยู่แล้ว", icon: "warning" });
    }

    setLoading(true);
    try {
      const payload = { code: trimmedCode, description: data.description.trim() };
      await axios.post(`${API_BASE_URL}/cscodes`, payload, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({ title: "สำเร็จ!", text: "เพิ่ม CSCode เรียบร้อย", icon: "success" });
      reset();
      fetchCSCodes();
    } catch (error) {
      console.error("❌ Error response:", error.response?.data || error.message);
      Swal.fire({ title: "เกิดข้อผิดพลาด!", text: error.response?.data?.message || "ไม่สามารถเพิ่ม CSCode ได้", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 📌 ฟังก์ชันลบ CSCode
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });

    const confirm = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการลบ CSCode นี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/cscodes/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      Swal.fire({ title: "ลบสำเร็จ!", text: "CSCode ถูกลบแล้ว", icon: "success" });
      fetchCSCodes();
    } catch (error) {
      Swal.fire({ title: "เกิดข้อผิดพลาด!", text: error.response?.data?.message || "ไม่สามารถลบ CSCode ได้", icon: "error" });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">เพิ่ม CSCode</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">CSCode</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" 
              placeholder="กรอก CSCode" {...register("code", { required: "กรุณากรอก CSCode" })} />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">รายละเอียด</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="กรอกรายละเอียด" {...register("description")} />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "เพิ่ม CSCode"}
          </button>
        </form>
      </div>

      {/* 📌 แสดงรายการ CSCode */}
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-2">รายการ CSCode</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">CSCode</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {csCodes.map((csCode) => (
              <tr key={csCode._id} className="text-center">
                <td className="border p-2">{csCode.code}</td>
                <td className="border p-2">{csCode.description}</td>
                <td className="border p-2">
                  <button onClick={() => navigate(`/edit-cscode/${csCode._id}`)} className="text-blue-600 mr-3">แก้ไข</button>
                  <button onClick={() => handleDelete(csCode._id)} className="text-red-600">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AddCSCodePage;
