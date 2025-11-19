// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); 
require('dotenv').config(); 

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');
const depositRoutes = require('./routes/depositRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// =======================================================
// (*** จุดที่ต้องแก้: ใช้ process.cwd() แทน __dirname ***)
// =======================================================
// Vercel ต้องการ process.cwd() เพื่อหาโฟลเดอร์ Root ของโปรเจกต์
const htmlPath = path.join(process.cwd(), 'HTML');

// บอก Express ว่าไฟล์ static อยู่ที่ไหน
app.use(express.static(htmlPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/notifications', notificationRoutes);
app.use('/api/deposits', depositRoutes);

// (*** แก้ไข: Route หน้าเว็บ ให้ใช้ตัวแปร htmlPath ***)
app.get('/', (req, res) => {
    res.sendFile(path.join(htmlPath, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(htmlPath, 'index.html'));
});
// =======================================================

const PORT = process.env.PORT || 5000; 

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;