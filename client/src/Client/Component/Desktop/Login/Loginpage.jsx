import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LogoADCM from "../../../../assets/Image/Logo-Login.png";

const LoginPage = ({ setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup"); // เปลี่ยนเส้นทางไปหน้าสมัครสมาชิก
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    console.log("🔎 ตรวจสอบ Token:", token, "Role:", role);

    if (token && role) {
      navigate(role === "admin" ? "/admin/dashboard" : "/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Response จาก API:", response.data);

      if (response.status === 200) {
        const { token, role } = response.data;  // ✅ ดึง role ตรง ๆ จาก response

        if (!token || !role) {
          console.error("❌ API ไม่ส่ง token หรือ role มา");
          setMessage("ไม่พบ token หรือ role จาก API");
          return;
        }

        console.log("✅ Token:", token, "Role:", role);

        // ✅ เก็บ token และ role ลง sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);

        console.log("📦 token:", sessionStorage.getItem("token"));
        console.log("📦 role:", sessionStorage.getItem("role"));

        setMessage("เข้าสู่ระบบสำเร็จ!");

        // ✅ ปิด popup ถ้ามีการส่ง setIsOpen เข้ามา
        setIsOpen?.(false);

        // ✅ Redirect ตาม role
        navigate(role === "admin" ? "/admin/dashboard" : "/home");

      } else {
        setMessage("เข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      console.error("❌ ข้อผิดพลาด:", error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    }
 
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={LogoADCM} alt="Logo" className="w-40 h-40 object-contain" />
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

LoginPage.propTypes = {
  setIsOpen: PropTypes.func, // ✅ ไม่บังคับส่ง prop นี้
};

export default LoginPage;
