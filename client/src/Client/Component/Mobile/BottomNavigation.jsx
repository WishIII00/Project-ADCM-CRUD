import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, Repeat, LogIn, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const token = sessionStorage.getItem('token'); // เช็ค token ว่ามีอยู่ใน sessionStorage หรือไม่

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const navItems = [
    { name: 'หน้าแรก', path: '/', icon: <Home size={24} /> },
    { name: 'เปรียบเทียบ', path: '/compare', icon: <Repeat size={24} /> },
  ];

  const categoryItems = [
    { name: 'กล้องวงจร', path: '/cctv' },
    { name: 'แผงโซล่าเซลล์', path: '/categories/solar' },
    { name: 'ระบบเน็ตเวิร์ค', path: '/categories/network' },
    { name: 'จัดเซตโปรโมชั่น', path: '/categories/promotion' },
  ];

  const handleLogout = () => {
    // ลบ token ออกจาก sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/'); // นำทางไปหน้า loginPage
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 block md:hidden lg:hidden">
      <ul className="flex justify-around items-center py-2 relative">
        {/* หน้าแรก */}
        <li>
          <Link
            to="/"
            className={`flex flex-col items-center text-sm ${
              location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Home size={24} />
            <span className="mt-1">หน้าแรก</span>
          </Link>
        </li>

        {/* หมวดหมู่ Dropdown */}
        <li className="relative">
          <button
            onClick={toggleDropdown}
            className="flex flex-col items-center text-sm text-gray-500 focus:outline-none"
          >
            <List size={24} />
            <span className="mt-1 flex items-center">
              หมวดหมู่ <ChevronDown size={16} className="ml-1" />
            </span>
          </button>

          {isDropdownOpen && (
            <ul className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg w-48 z-50">
              {categoryItems.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    onClick={() => setDropdownOpen(false)} // ปิด dropdown เมื่อเลือกหมวดหมู่
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* เปรียบเทียบ */}
        <li>
          <Link
            to="/compare"
            className={`flex flex-col items-center text-sm ${
              location.pathname === '/compare' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Repeat size={24} />
            <span className="mt-1">เปรียบเทียบ</span>
          </Link>
        </li>

        {/* ถ้าผู้ใช้เข้าสู่ระบบแล้ว แสดงปุ่มออกจากระบบ */}
        {token ? (
          <li>
            <button
              onClick={handleLogout}
              className={`flex flex-col items-center text-sm text-gray-500`}
            >
              <LogOut size={24} />
              <span className="mt-1">ออกจากระบบ</span>
            </button>
          </li>
        ) : (
          // ถ้ายังไม่เข้าสู่ระบบให้แสดง "เข้าสู่ระบบ"
          <li>
            <Link
              to="/loginPage"
              className={`flex flex-col items-center text-sm ${
                location.pathname === '/login' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <LogIn size={24} />
              <span className="mt-1">เข้าสู่ระบบ</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
