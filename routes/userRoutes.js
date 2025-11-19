// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getUsersForAssignment,
    adminGetAllUsers,  // <-- เพิ่ม
    adminUpdateUser,   // <-- เพิ่ม
    adminDeleteUser    // <-- เพิ่ม
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { protectAdmin } = require('../middleware/adminMiddleware'); // <-- เพิ่ม Middleware ใหม่

// GET /api/users (สำหรับ Dropdown สั่งงาน)
router.get('/', protect, getUsersForAssignment);

// --- (*** เพิ่มเส้นทางสำหรับ Admin ***) ---

// GET /api/users/admin/all (ดึง User "ทุกคน" มาแสดงในตาราง)
router.get('/admin/all', protect, protectAdmin, adminGetAllUsers);

// PUT /api/users/admin/:id (แก้ไข User)
router.put('/admin/:id', protect, protectAdmin, adminUpdateUser);

// DELETE /api/users/admin/:id (ลบ User)
router.delete('/admin/:id', protect, protectAdmin, adminDeleteUser);

module.exports = router;