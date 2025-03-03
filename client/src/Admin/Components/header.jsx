import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ ใช้ Path ที่ถูกต้อง
import LogoADCM from "../../assets/Image/Logo01.png";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.removeItem("token"); // ✅ ลบ Token ออกจาก sessionStorage
    navigate("/"); // ✅ กลับไปหน้า Login
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-gradient-to-r from-[#63a6dd] via-[#63a6dd] to-[#00C999] text-white shadow-md z-50 flex items-center justify-between px-6 py-4">
      {/* ✅ Logo อยู่ด้านซ้าย */}
      <div className="flex items-center">
        <Link to="/Home" className="flex items-center gap-2 text-white">
          <img
            src={LogoADCM}
            alt="ADC Microsystems"
            className="h-12 sm:h-14 md:h-16 lg:h-16 xl:h-16 w-auto object-cover cursor-pointer"
          />
        </Link>
      </div>

      {/* ✅ "ระบบคลังสินค้า" อยู่ตรงกลางในขนาด md ขึ้นไป */}
      <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-xl md:text-3xl font-bold text-white drop-shadow-lg">
        ระบบคลังสินค้า
      </h1>

      {/* ✅ ปุ่ม Toggle Sidebar + ปุ่มออกจากระบบ (อยู่ขวาสุด) */}
      <div className="flex items-center space-x-6">
        {/* ✅ ปุ่ม Toggle Sidebar สำหรับมือถือ */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 bg-gray-700 text-white rounded"
          aria-controls="sidebar"
          aria-expanded="false"
        >
          <Menu size={24} />
        </button>

        {/* ✅ ปุ่มออกจากระบบ */}
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};
