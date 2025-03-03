import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LogoADCM from "../../../../assets/Image/Logo-Login.png";

const LoginPopup = ({ setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Response data:", response.data);

      if (response.status === 200) {
        const { token, role } = response.data; // ✅ ดึง role ตรงจาก response

        if (!token || !role) {
          setMessage("ไม่พบ token หรือ role จาก API");
          console.error("❌ ไม่พบ token หรือ role ใน response");
          return;
        }

        console.log("✅ token:", token);
        console.log("✅ role:", role);

        // ✅ เก็บ token และ role ลง sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);

        console.log("📦 token ใน sessionStorage:", sessionStorage.getItem("token"));
        console.log("📦 role ใน sessionStorage:", sessionStorage.getItem("role"));

        setMessage("เข้าสู่ระบบสำเร็จ!");
        setIsOpen(false); // ปิด popup หลังเข้าสู่ระบบสำเร็จ

        // 🔥 Redirect ตาม role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }

      } else {
        setMessage("เข้าสู่ระบบล้มเหลว");
        console.error("❌ สถานะ response ไม่ใช่ 200");
      }

    } catch (error) {
      console.error("❌ Error:", error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/signup"); // เปลี่ยนเส้นทางไปหน้าสมัครสมาชิก
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>

        <div className="flex justify-center mb-4">
          <img src={LogoADCM} alt="Logo" className="w-60 h-60 object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">เข้าสู่ระบบ</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="กรอกอีเมล"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          {message && (
            <p className={`text-center text-sm font-medium ${message === "เข้าสู่ระบบสำเร็จ!" ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* เพิ่มปุ่มสำหรับสมัครสมาชิก */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">ยังไม่มีบัญชี?</p>
          <button
            onClick={handleSignUp}
            className="text-red-500 hover:text-red-700 text-sm font-semibold mt-2"
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>
    </div>
  );
};

LoginPopup.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default LoginPopup;
