import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import StatsCards from "../Components/StatsCards";
import LatestProductsTable from "../Components/LatestProductsTable";
import PromotionTable from "../Components/PromotionTable";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    console.log("🔎 ตรวจสอบ Token:", token, "Role:", role);

    if (!token) {
      console.warn("❌ ไม่มี token - กลับไปหน้า login");
      navigate("/loginPage");
      return;
    }

    if (role !== "admin") {
      console.warn("❌ ไม่ใช่ admin - กลับไปหน้าแรก");
      navigate("/");  // ✅ แก้ตรงนี้เพื่อไม่ให้วนลูป
      return;
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <StatsCards />
        <LatestProductsTable />
        <PromotionTable />
      </div>
    </AdminLayout>
  );
}
