// server.js (เวอร์ชันสำหรับ Vercel)

// 1. Import Packages
const express = require('express');
const cors = require('cors');
const path = require('path'); // (*** เพิ่ม: เพื่อจัดการ Path ไฟล์ ***)
const connectDB = require('./config/db'); 
require('dotenv').config(); 

// 2. Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');

// 3. สร้าง Express App
const app = express();

// 4. เชื่อมต่อฐานข้อมูล
connectDB();

// 5. Middleware
app.use(cors());
app.use(express.json());

// (*** เพิ่ม: ให้ Server เสิร์ฟไฟล์ Static ในโฟลเดอร์ HTML ***)
// บรรทัดนี้จะทำให้ไฟล์ index.html, login.html ถูกเรียกใช้ได้
app.use(express.static(path.join(__dirname, 'HTML')));

// 6. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/notifications', notificationRoutes);

// (*** เพิ่ม: Route สำหรับหน้าแรก (Root) ***)
// ถ้าเข้าเว็บมาเฉยๆ ให้เด้งไปหน้า login.html ก่อน
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'login.html'));
});

// (*** เพิ่ม: Route สำหรับหน้า Dashboard ***)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});

// 7. รันเซิร์ฟเวอร์ (Export app เพื่อให้ Vercel ใช้งาน)
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// (*** สำคัญสำหรับ Vercel: ต้อง export app ***)
module.exports = app;