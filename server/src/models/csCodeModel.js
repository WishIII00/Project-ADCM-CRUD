// ดึง Dependencies จาก package
const mongoose = require('mongoose');

// โครงร่าง CSCode
const CSCodeSchema = new mongoose.Schema({
    code: { type: String, required: [true, 'จำเป็นต้องมี CSCode'], unique: true, trim: true },
    description: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now } // ✅ แก้ชื่อให้ถูกต้อง
});

// ส่งออกโมเดลสินค้า
module.exports = mongoose.model('CSCode', CSCodeSchema);
