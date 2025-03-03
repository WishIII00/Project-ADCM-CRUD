import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ roleRequired }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  console.log("🔒 ตรวจสอบ ProtectedRoute:", { token, role, roleRequired });

  // 🔒 ถ้าไม่มี token → กลับไปหน้า login
  if (!token) {
    console.warn("❌ ไม่มี token - Redirect ไป /loginPage");
    return <Navigate to="/loginPage" replace />;
  }

  // ✅ ถ้า role คือ "user" → อนุญาตเฉพาะเส้นทาง /home
  if (role === "user" && location.pathname !== "/home") {
    console.warn("❌ ผู้ใช้ทั่วไปเข้าเส้นทางนี้ไม่ได้ - Redirect ไป /home");
    return <Navigate to="/home" replace />;
  }

  // 🚫 ถ้ามี roleRequired แต่ role ไม่ตรง → กลับไปหน้าแรก
  if (roleRequired && role !== roleRequired) {
    console.warn(`❌ role ไม่ตรง: ต้องการ ${roleRequired} แต่ได้ ${role} - Redirect ไป /`);
    return <Navigate to="/" replace />;
  }

  console.log("✅ เข้าหน้าได้");
  return <Outlet />; // ✅ Render Route ย่อย
};

export default ProtectedRoute;
