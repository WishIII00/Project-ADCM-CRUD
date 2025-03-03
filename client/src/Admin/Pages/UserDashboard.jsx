import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import AdminLayout from "../Layouts/AdminLayout";
import TotalUsers from "../Components/StatsCards/TotalUsers";
import LogoADD from "../../assets/Image/addProduct.png";

const API_URL = "http://localhost:3000"; // เปลี่ยนเป็น URL ของ Backend จริง

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Fetch Users Error:", error.response);
      Swal.fire("Error", "ไม่สามารถโหลดข้อมูลได้", "error");
    }
  };

  const handleDelete = async (id) => {
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
          Swal.fire("ลบสำเร็จ", "ผู้ใช้ถูกลบแล้ว", "success");
          fetchUsers(); // โหลดข้อมูลใหม่
        } catch (error) {
          Swal.fire("ผิดพลาด", "ไม่สามารถลบผู้ใช้ได้", "error");
        }
      }
    });
  };

  return (
    <AdminLayout>
        <div className="w-full max-w-full mx-auto rounded-t-2xl shadow-2xl bg-white overflow-hidden">
            {/* ส่วนหัว */}
            <div className="w-full bg-[#007bff] text-white p-5 flex items-center gap-4 justify-start">
              <img
                src={LogoADD}
                alt="เพิ่มข้อมูลสินค้า"
                className="h-12 w-auto object-cover cursor-pointer"
              />
              <h2 className="text-2xl sm:text-3xl font-bold">จัดการผู้ใช้</h2>
            </div>
      <div className="container mx-auto p-4">
        {/* ✅ แสดงจำนวนผู้ใช้ทั้งหมด */}
        <div className="mb-6">
          <TotalUsers />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          📋 รายการผู้ใช้
        </h2>

        {/* ✅ ทำให้ตาราง Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">บริษัท</th>
                <th className="px-4 py-2 text-left">เบอร์โทร</th>
                <th className="px-4 py-2 text-left">หมายเลขภาษี</th>
                <th className="px-4 py-2 text-left">บทบาท</th>
                <th className="px-4 py-2 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.companyName}</td>
                    <td className="px-4 py-2">{user.phoneNumber}</td>
                    <td className="px-4 py-2">{user.taxNumber}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          user.role === "admin" ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      {/* ปุ่มแก้ไข */}
                      <button
                        onClick={() => navigate(`/edit-user/${user._id}`)}
                        className="flex items-center bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                      >
                        ✏️  แก้ไข
                      </button>

                      {/* ปุ่มลบ */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                         🗑️  ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    ❌ ไม่มีข้อมูลผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default UserDashboard;
