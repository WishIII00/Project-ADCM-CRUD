import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavbarDesktop from "../Component/Desktop/Navbar/NavbarDesktop";
import Footer from "./Footer";
import BottomNavigation from "./Mobile/BottomNavigation"; // นำเข้า BottomNavigation
import LoginPage from "../Component/Desktop/Login/Login";
import NavbarMobile from "./Mobile/NavbarMobile";

const MainLayout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false); // ใช้สำหรับ Pop-up Login

  return (
    <>
      <NavbarDesktop onLoginClick={() => setIsLoginOpen(true)} />
      {isLoginOpen && <LoginPage setIsOpen={setIsLoginOpen} />}
      <NavbarMobile />
      <Outlet />
      <Footer />
      {/* ให้แน่ใจว่า BottomNavigation อยู่ในตำแหน่งที่ถูกต้อง */}
      <BottomNavigation />
    </>
  );
};

export default MainLayout;
