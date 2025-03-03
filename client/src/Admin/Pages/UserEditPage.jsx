import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import AdminLayout from "../Layouts/AdminLayout";

const API_URL = "http://localhost:3000"; // เปลี่ยนเป็น URL ของ Backend จริง

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    companyName: "",
    address: "",
    phoneNumber: "",
    taxNumber: "",
    role: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      Swal.fire("Error", "ไม่สามารถโหลดข้อมูลผู้ใช้ได้", "error");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`${API_URL}/api/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire("✅ สำเร็จ!", "อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว", "success");
      navigate("/dashboard");
    } catch (error) {
      Swal.fire("❌ ผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้", "error");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem("token");
          await axios.delete(`${API_URL}/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("✅ ลบสำเร็จ", "ผู้ใช้ถูกลบแล้ว", "success");
          navigate("/dashboard");
        } catch (error) {
          Swal.fire("❌ ผิดพลาด", "ไม่สามารถลบผู้ใช้ได้", "error");
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
          ✏️ แก้ไขข้อมูลผู้ใช้
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ชื่อผู้ใช้ (แก้ไขไม่ได้) */}
          <div>
            <label className="block text-gray-700 font-medium">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={user.username}
              disabled
              className="w-full p-3 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          {/* อีเมล (แก้ไขไม่ได้) */}
          <div>
            <label className="block text-gray-700 font-medium">อีเมล</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="w-full p-3 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          {/* บริษัท */}
          <div>
            <label className="block text-gray-700 font-medium">บริษัท</label>
            <input
              type="text"
              name="companyName"
              value={user.companyName}
              onChange={handleChange}
              className="w-full p-3 border border-blue-500 rounded-lg"
            />
          </div>

          {/* ที่อยู่ */}
          <div>
            <label className="block text-gray-700 font-medium">ที่อยู่</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full p-3 border border-blue-500 rounded-lg"
            />
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-gray-700 font-medium">เบอร์โทร</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-blue-500 rounded-lg"
            />
          </div>

          {/* หมายเลขภาษี */}
          <div>
            <label className="block text-gray-700 font-medium">หมายเลขภาษี</label>
            <input
              type="text"
              name="taxNumber"
              value={user.taxNumber}
              onChange={handleChange}
              className="w-full p-3 border border-blue-500 rounded-lg"
            />
          </div>

          {/* Role (แก้ไขไม่ได้) */}
          <div>
            <label className="block text-gray-700 font-medium">บทบาท</label>
            <input
              type="text"
              name="role"
              value={user.role}
              disabled
              className="w-full p-3 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          {/* ✅ ปุ่มบันทึก + ปุ่มลบ + ปุ่มยกเลิก */}
          <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-4 justify-end">
          
            <button
              type="button"
              onClick={() => navigate("/UserDashboard")}
              className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition"
            >
              ลบผู้ใช้
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition"
            >
              ✅ บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditUserPage;
