// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// เราจะ import 2 ฟังก์ชันจาก authController
const { registerUser, loginUser } = require('../controllers/authController');

// สร้าง 2 Endpoints

// 1. POST /api/auth/register (สำหรับสร้าง User ใหม่ พร้อมเข้ารหัสผ่าน)
router.post('/register', registerUser);

// 2. POST /api/auth/login (สำหรับ Login จริง)
router.post('/login', loginUser);

module.exports = router;