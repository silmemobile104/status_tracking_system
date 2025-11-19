// config/db.js (เวอร์ชันอัปเดต - แก้ Warning)

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // ใน Mongoose v6+ ไม่ต้องใส่ options แล้ว
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('MongoDB เชื่อมต่อสำเร็จ!');
    } catch (err) {
        console.error('MongoDB เชื่อมต่อล้มเหลว:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;