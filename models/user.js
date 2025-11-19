// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// สร้าง Schema ตามโครงสร้างที่เราออกแบบไว้
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // ห้ามซ้ำ
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    companyId: {
        type: String, // เราใช้ String "company_1_id", "company_2_id"
        ref: 'Company' 
    },
    role: {
        type: String,
        required: true,
        enum: ['executive', 'manager', 'hr', 'staff'] // ต้องเป็นค่าใดค่าหนึ่งในนี้
    },
    department: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        default: null // ไม่จำเป็นต้องมี (เช่น ผู้บริหาร)
    },
    reportsTo: {
        // type: String, // <-- ลบอันเก่า
        type: Schema.Types.ObjectId, // <-- *** ใช้อันนี้ ***
        ref: 'User', // อ้างอิงกลับมาที่ User (หัวหน้า)
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ส่งออก Model นี้ไปให้ Controller ใช้
module.exports = mongoose.model('User', UserSchema);