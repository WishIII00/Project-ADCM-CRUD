// src/components/Nav/MenuDropdown.jsx
import { Link } from "react-router-dom"; // ✅ ใช้ Link สำหรับนำทาง

const MENU_SECTION_1 = [{ label: "หน้าแรก", path: "/" }];
const MENU_SECTION_2 = [
  { label: "กล้องวงจร", path: "/cctv" },
  { label: "แผงโซล่าเซลล์", path: "/solar-panel" },
  { label: "ระบบเน็ตเวิร์ค", path: "/network" },
  { label: "จัดเซตโปรโมชั่น", path: "/promotion-set" },
];
const MENU_SECTION_3 = [
  { label: "เกี่ยวกับเรา", path: "/about" },
  { label: "ติดต่อ", path: "/contact" },
];

export default function MenuDropdown() {
  return (
    <div className="bg-gray-100 p-3 shadow-md hidden md:block">
      <div className="mx-auto w-full flex items-center justify-between gap-2 lg:gap-4 xl:px-20">
        
        {/* ✅ Section 1 - หน้าแรก */}
        <div className="flex items-center gap-2">
          {MENU_SECTION_1.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-lg"
            >
              {menu.label}
            </Link>
          ))}
        </div>

        {/* ✅ Section 2 - เมนูปกติ */}
        <div className="flex items-center gap-2 lg:gap-8 xl:gap-26">
          {MENU_SECTION_2.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-base"
            >
              {menu.label}
            </Link>
          ))}
        </div>

        {/* ✅ Section 3 - เกี่ยวกับเรา & ติดต่อ */}
        <div className="flex items-center gap-4 lg:gap-16">
          {MENU_SECTION_3.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="px-2 lg:px-3 py-1 text-black font-semibold hover:text-blue-500 whitespace-nowrap text-sm lg:text-base"
            >
              {menu.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
