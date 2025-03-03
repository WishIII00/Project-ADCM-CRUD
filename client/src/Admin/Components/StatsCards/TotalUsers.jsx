import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";

const API_URL = "http://localhost:3000"; // เปลี่ยนเป็น URL ของ Backend จริง

export default function TotalUsers() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 ฟังก์ชันดึงจำนวนผู้ใช้ทั้งหมด
  const fetchTotalUsers = () => {
    setLoading(true);
    const token = sessionStorage.getItem("token"); // ✅ ดึง Token จาก SessionStorage

    axios.get(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปกับ API
      },
    })
      .then(response => {
        console.log("✅ API Response:", response.data);
        setCount(response.data.count || 0);
      })
      .catch(error => {
        console.error("❌ Fetch Total Users Error:", error.response);
        setError("ไม่สามารถโหลดข้อมูลได้");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col justify-between min-w-[200px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-1 bg-gray-100 rounded-lg">
            <Users size={28} className="text-gray-700" />
          </div>
          <p className="text-md text-gray-500 font-medium">จำนวนผู้ใช้ทั้งหมด</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h3 className="text-3xl font-bold text-green-500">
            {loading ? "..." : error ? "Error" : count}
          </h3>
        </div>
      </div>
      <hr className="border-t-2 border-gray-300 mt-4 w-full" />
    </div>
  );
}
