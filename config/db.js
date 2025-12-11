// config/db.js (เวอร์ชันอัปเดต - แก้ Warning)

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // ใน Mongoose v6+ ไม่ต้องใส่ options แล้ว
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB เชื่อมต่อสำเร็จ!');

        // DEBUG
        try {
            const User = require('../models/user');
            const ImportRequest = require('../models/importRequest');
            const admin = await User.findOne({ username: 'admin' });
            console.log('DEBUG: Admin:', admin ? `${admin.username} (${admin.companyId}, ${admin.role})` : 'Not found');
            const imports = await ImportRequest.find({});
            console.log('DEBUG: Imports Count:', imports.length);
            imports.forEach(i => console.log(`DEBUG: Import ${i._id}: Company=${i.companyId}, Type=${i.type}, Branch=${i.branch}`));
        } catch (e) {
            console.log('DEBUG ERROR:', e);
        }
    } catch (err) {
        console.error('MongoDB เชื่อมต่อล้มเหลว:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;