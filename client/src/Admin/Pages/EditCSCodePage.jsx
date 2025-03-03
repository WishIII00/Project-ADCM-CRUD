import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminLayout from "../Layouts/AdminLayout";

const API_BASE_URL = "http://localhost:3000/api";

const EditCSCodePage = () => {
  const { id } = useParams(); // ✅ ดึง ID จาก URL
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 📌 โหลดข้อมูล CSCode ตาม ID
  useEffect(() => {
    fetchCSCode();
  }, []);

  const fetchCSCode = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cscodes/${id}`);
      setValue("code", response.data.CSCodeData.code);
      setValue("description", response.data.CSCodeData.description);
    } catch (error) {
      Swal.fire({ title: "เกิดข้อผิดพลาด!", text: "ไม่พบข้อมูล CSCode", icon: "error" });
      navigate(-1);
    }
  };

  // 📌 ฟังก์ชันแก้ไข CSCode
  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return Swal.fire({ title: "ไม่ได้เข้าสู่ระบบ!", text: "กรุณาเข้าสู่ระบบก่อนทำรายการ", icon: "error" });
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/cscodes/${id}`, 
        { code: data.code.trim(), description: data.description.trim() },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({ title: "สำเร็จ!", text: "แก้ไข CSCode เรียบร้อย", icon: "success" });
      navigate("/add-cscode"); // ✅ กลับไปหน้าหลัก
    } catch (error) {
      Swal.fire({ title: "เกิดข้อผิดพลาด!", text: error.response?.data?.message || "ไม่สามารถแก้ไข CSCode ได้", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">แก้ไข CSCode</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">CSCode</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("code", { required: "กรุณากรอก CSCode" })} />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">รายละเอียด</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              {...register("description")} />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>
        </form>

        {/* ปุ่มย้อนกลับ */}
        <button onClick={() => navigate(-1)} className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
          ย้อนกลับ
        </button>
      </div>
    </AdminLayout>
  );
};

export default EditCSCodePage;
