import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP({ email }) {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const verifyOtp = async () => {
        if (!otp) {
            Swal.fire("แจ้งเตือน!", "กรุณากรอก OTP", "warning");
            return;
        }

        console.log("🔍 ส่ง OTP:", { email, otp });

        try {
            const res = await axios.post("http://localhost:3000/api/auth/verifyOTP", { email, otp });
            Swal.fire("สำเร็จ!", res.data.message, "success");

            // เมื่อยืนยัน OTP สำเร็จแล้ว นำทางไปหน้า /home
            navigate("/home");

        } catch (error) {
            console.error("❌ Error Response:", error.response);
            Swal.fire("เกิดข้อผิดพลาด!", error.response?.data?.message || "OTP ไม่ถูกต้อง", "error");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">ยืนยัน OTP</h2>
                <p className="text-center text-gray-700 mb-6">กรุณาใส่รหัส OTP ที่ส่งไปยังอีเมลของคุณ</p>
                
                <div className="mb-4">
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="กรอกรหัส OTP"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button 
                    onClick={verifyOtp}
                    className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
                >
                    ยืนยัน OTP
                </button>
            </div>
        </div>
    );
}
