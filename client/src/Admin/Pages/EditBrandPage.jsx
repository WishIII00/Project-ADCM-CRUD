import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Layouts/AdminLayout";

const API_BASE_URL = "http://localhost:3000/api";

const EditBrandPage = () => {
  const { id } = useParams(); // 📌 ดึง ID จาก URL
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");

  // 📌 โหลดข้อมูลแบรนด์เมื่อเปิดหน้า
  useEffect(() => {
    axios.get(`${API_BASE_URL}/brands/${id}`)
      .then((res) => setBrand(res.data.name))
      .catch(() => Swal.fire("เกิดข้อผิดพลาด!", "ไม่พบแบรนด์", "error"));
  }, [id]);

  // 📌 ฟังก์ชันอัปเดตแบรนด์
  const handleUpdate = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });
    }

    try {
      await axios.put(`${API_BASE_URL}/brands/${id}`, { name: brand }, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      Swal.fire("สำเร็จ!", "อัปเดตแบรนด์เรียบร้อย", "success");
      navigate("/add-brand"); // 📌 กลับไปหน้ารายการแบรนด์
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", error.response?.data?.message || "ไม่สามารถอัปเดตแบรนด์ได้", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">แก้ไขแบรนด์</h2>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="แก้ไขชื่อแบรนด์"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4">
          อัปเดตแบรนด์
        </button>
      </div>
    </AdminLayout>
  );
};

export default EditBrandPage;
