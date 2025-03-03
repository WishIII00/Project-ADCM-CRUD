import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Home, PackagePlus, Users } from "lucide-react";
import clsx from "clsx";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* ✅ Overlay สำหรับมือถือ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* ✅ Sidebar คงที่และอยู่ติดกับ Header */}
      <div
        id="sidebar"
        className={clsx(
          "fixed md:fixed top-[80px] left-0 w-64 h-[calc(100vh-50px)] bg-gray-200 text-black text-2xl p-7 transition-transform duration-300 z-50 flex flex-col overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-64",
          "md:translate-x-0"
        )}
      >
        <nav className="space-y-7">
          {/* 🔹 หน้าแรก */}
          <Link
            to="/admin/dashboard"
            className={clsx(
              "flex items-center gap-2 p-2 rounded transition-all",
              location.pathname === "/admin/dashboard"
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-500 hover:text-white active:bg-blue-700"
            )}
          >
            <Home size={25} /> หน้าแรก
          </Link>

          {/* 🔹 เพิ่มสินค้า */}
          <Link
            to="/add-product"
            className={clsx(
              "flex items-center gap-2 p-2 rounded transition-all",
              location.pathname === "/add-product"
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-500 hover:text-white active:bg-blue-700"
            )}
          >
            <PackagePlus size={20} /> เพิ่มสินค้า
          </Link>

          {/* 🔹 จัดการผู้ใช้ (ลิงก์ตรง) */}
          <Link
            to="/UserDashboard"
            className={clsx(
              "flex items-center gap-2 p-2 rounded transition-all",
              location.pathname === "/UserDashboard"
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-500 hover:text-white active:bg-blue-700"
            )}
          >
            <Users size={20} /> จัดการผู้ใช้
          </Link>
            
          {/* 🔹 การตั้งค่า (ลิงก์ตรง) */}
          <Link
            to="/add-brand"
            className={clsx(
              "flex items-center gap-2 p-2 rounded transition-all",
              location.pathname === "/UserDashboard"
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-500 hover:text-white active:bg-blue-700"
            )}
          >
            <Users size={20} /> การตั้งค่า
          </Link>
        </nav>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
