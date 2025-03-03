import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import VerifyOTP from "./VerifyOTP";
import { useNavigate } from "react-router-dom";
import LogoADCM from "../../assets/Image/Logo-Login.png"

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // ใช้สำหรับนำทางกลับไปหน้าหลัก

  // ฟังก์ชันสมัครสมาชิก
  const onSubmit = async (data) => {
    const formattedData = {
      name: `${data.firstName} ${data.lastName}`,
      companyName: data.companyName || "N/A",
      password: data.password,
      email: data.email,
      address: data.address || "N/A",
      phoneNumber: data.phoneNumber || "0000000000",
      taxNumber: data.taxNumber || "0000000000000"
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", formattedData, {
        headers: { "Content-Type": "application/json" }
      });
      Swal.fire("สำเร็จ!", res.data.message, "success");
      setOtpSent(true);
      setEmail(data.email);
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-cyan-500">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={LogoADCM} alt="Logo" className="h-26" />
        </div>

        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">สมัครสมาชิก</h2>

        {/* ฟอร์ม */}
        {!otpSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
                <input 
                  type="text" 
                  {...register("firstName", { required: "กรุณากรอกชื่อ" })} 
                  placeholder="ระบุชื่อ"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">นามสกุล</label>
                <input 
                  type="text" 
                  {...register("lastName", { required: "กรุณากรอกนามสกุล" })} 
                  placeholder="ระบุนามสกุล"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* อีเมล */}
            <div>
              <label className="block text-sm font-medium text-gray-700">อีเมล</label>
              <input 
                type="email" 
                {...register("email", { required: "กรุณากรอกอีเมล" })} 
                placeholder="กรอกอีเมล"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
              <input 
                type="password" 
                {...register("password", { required: "กรุณากรอกรหัสผ่าน" })} 
                placeholder="กรอกรหัสผ่าน"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* อื่นๆ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ชื่อบริษัท</label>
              <input 
                type="text" 
                {...register("companyName")} 
                placeholder="ระบุชื่อบริษัท (ถ้ามี)"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
              <input 
                type="text" 
                {...register("address")} 
                placeholder="กรอกที่อยู่"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">หมายเลขโทรศัพท์</label>
              <input 
                type="tel" 
                {...register("phoneNumber")} 
                placeholder="กรอกหมายเลขโทรศัพท์"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">เลขประจำตัวผู้เสียภาษี</label>
              <input 
                type="text" 
                {...register("taxNumber")} 
                placeholder="กรอกเลขประจำตัวผู้เสียภาษี"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            {/* ปุ่มสมัครสมาชิกและยกเลิก */}
            <div className="flex gap-4 mt-6">

              {/* ปุ่มยกเลิก */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-all"
              >
                ยกเลิก
              </button>
                
              {/* ปุ่มสมัครสมาชิก */}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all">
                สมัครสมาชิก
              </button>
            </div>
          </form>
        ) : (
          <VerifyOTP email={email} />
        )}
      </div>
    </div>
  );
}
