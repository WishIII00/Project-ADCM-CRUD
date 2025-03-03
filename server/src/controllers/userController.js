// ดึง Dependencies จาก package
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const User = require('../models/userModel');

// ดูข้อมูลผู้ใช้งานทั้งหมด (แสดงทุก Role: user & admin)
const getUsers = async (req, res) => {
    try {
        // เรียกข้อมูลผู้ใช้งานทั้งหมด (ไม่มีตัวกรอง Role)
        const users = await User.find();

        // ตรวจสอบว่ามีข้อมูลผู้ใช้งานหรือไม่
        if (!users) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน' });
        }
        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// ดูโปรไฟล์
const getProfile = async (req, res) => {
    // ใช้ userId จาก decoded token
    const user = await User.findById(req.userId);
    try {
        if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        return res.status(200).json(user);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

// แก้ไขโปรไฟล์
const editProfile = async (req, res) => {

    console.log("User Role ที่ใช้แก้ไข:", req.userRole);
    console.log("ค่าที่รับมาจาก Frontend (role):", req.body.role);

    // ใช้ userId จาก decoded token
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });

    // รับข้อมูลจาก request body
    const { name, companyName, address, phoneNumber, taxNumber, role } = req.body;

    try {
        // อัพเดตข้อมูลโปรไฟล์
        user.username = name || user.username;
        user.companyName = companyName || user.companyName;
        user.address = address || user.address;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.taxNumber = taxNumber || user.taxNumber;

        // ✅ อัปเดต role (เฉพาะ Admin เท่านั้นที่เปลี่ยนได้)
        if (req.userRole === "admin" && role) {
            user.role = role;
        }
        

        // บันทึกข้อมูลที่แก้ไขลงในฐานข้อมูล
        await user.save();

        // ส่ง response กลับไปว่าแก้ไขสำเร็จ
        return res.status(200).json({
            message: 'อัปเดตโปรไฟล์สำเร็จแล้ว',
            user: {
                username: user.username,
                companyName: user.companyName,
                address: user.address,
                phoneNumber: user.phoneNumber,
                taxNumber: user.taxNumber,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


// ส่งอีเมล์สำหรับการรีเซ็ตรหัสผ่าน
const sendResetPasswordEmail = async (email, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'nitipat1389@gmail.com', // อีเมลที่ใช้ส่ง
            pass: 'kinpybhddcwrioxa',   // รหัสผ่านของอีเมล
        },
    });

    const resetURL = `http://localhost:3000/api/users/resetPassword/${resetToken}`; // ลิงก์สำหรับรีเซ็ตรหัสผ่าน

    const mailOptions = {
        from: 'nitipat1389@gmail.com',
        to: email,
        subject: 'คำขอรีเซ็ตรหัสผ่าน',
        text: `คุณได้ร้องขอการรีเซ็ตรหัสผ่าน คลิกลิงก์ด้านล่างเพื่อรีเซ็ตรหัสผ่านของคุณ:\n\n${resetURL}\n\nลิงก์นี้ใช้ได้เพียง 1 ชั่วโมงเท่านั้น`,
    };

    try { await transporter.sendMail(mailOptions); return true;
    } catch (error) { throw new Error('ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้'); }
};


// ลืมรหัสผ่าน
const forgetPassword = async (req, res) => {
    // รับข้อมูลจาก request body
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้ที่มีอีเมล์นี้' });
        // สร้าง Token สำหรับ Reset Password
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // บันทึก Token ลงในฐานข้อมูล
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // หมดอายุใน 1 ชั่วโมง
        await user.save();
        await sendResetPasswordEmail(user.email, resetToken); // ส่งอีเมลรีเซ็ตรหัสผ่าน
        return res.status(200).json({ message: 'ลิงค์รีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมล์ของคุณแล้ว' });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// รีเซ็ตรหัสผ่าน
const resetPassword = async (req, res) => {
    const { token } = req.params; // รับข้อมูลจาก request params
    const { newPassword } = req.body; // รับข้อมูลจาก request body
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ Token
        // ค้นหาผู้ใช้ที่มี Token นี้
        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // ตรวจสอบว่า Token ยังไม่หมดอายุ
        });

        if (!user) return res.status(400).json({ message: 'โทเค็นไม่ถูกต้องหรือหมดอายุ' });
        user.password = newPassword;
        // ล้าง Token รีเซ็ตรหัสผ่าน
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        return res.status(200).json({ message: 'รหัสผ่านของคุณได้รับการรีเซ็ตเรียบร้อยแล้ว' });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("🛠️ กำลังลบผู้ใช้ ID:", id); // ✅ Debug ID

        const user = await User.findByIdAndDelete(id); // ✅ เพิ่ม await
        if (!user) {
            console.log("❌ ไม่พบผู้ใช้ในระบบ");
            return res.status(404).json({ message: "ไม่พบผู้ใช้" }); // ✅ เปลี่ยนเป็น 404 Not Found
        }

        console.log("✅ ผู้ใช้ถูกลบเรียบร้อยแล้ว");
        return res.status(200).json({ message: "ลบผู้ใช้เรียบร้อยแล้ว" });
    } catch (error) {
        console.error("❌ Delete User Error:", error.message);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
    }
};

const editUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id); // ✅ เพิ่ม await
        if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

        // รับข้อมูลจาก request body
        const { companyName, address, phoneNumber, taxNumber, role } = req.body;

        // ✅ อัปเดตข้อมูลที่อนุญาตให้แก้ไข
        user.companyName = companyName || user.companyName;
        user.address = address || user.address;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.taxNumber = taxNumber || user.taxNumber;

        // ✅ อัปเดต role (เฉพาะ Admin เท่านั้นที่เปลี่ยนได้)
        if (req.userRole === "admin" && role) {
            user.role = role;
        }

        await user.save(); // ✅ บันทึกข้อมูล

        return res.status(200).json({
            message: "อัปเดตโปรไฟล์สำเร็จแล้ว",
            user: {
                username: user.username,
                companyName: user.companyName,
                address: user.address,
                phoneNumber: user.phoneNumber,
                taxNumber: user.taxNumber,
                role: user.role, // ✅ ส่ง role กลับไปด้วย
            }
        });
    } catch (error) {
        console.error("❌ Edit User Error:", error.message);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้" });
    }
};

// ส่งออกโมดูล
module.exports = {
    getUsers,
    getProfile,
    editProfile,
    forgetPassword,
    resetPassword,
    deleteUser,
    getUserById,
    editUser
}