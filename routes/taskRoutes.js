// server/routes/taskRoutes.js

const express = require('express');
const router = express.Router();

const { 
    createTask, 
    getTasksForDashboard,
    getTaskById,
    updateTask, // (*** 1. แก้ไขชื่อ: จาก updateTaskStatus เป็น updateTask ***)
    getTaskStats,
    deleteTask  // (*** 2. เพิ่ม: deleteTask ***)
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

// POST /api/tasks (สร้างงาน)
router.post('/', protect, createTask);

// GET /api/tasks (ดึงงานทั้งหมดใน Dashboard)
router.get('/', protect, getTasksForDashboard);

// GET /api/tasks/stats (ดึงข้อมูลสรุปสถิติ)
router.get('/stats', protect, getTaskStats);

// GET /api/tasks/:id (ดึงข้อมูลงานชิ้นเดียว)
router.get('/:id', protect, getTaskById);

// (*** 3. แก้ไข Route: ให้เรียกฟังก์ชันใหม่ชื่อ updateTask ***)
// PUT /api/tasks/:id (อัปเดตงาน)
router.put('/:id', protect, updateTask);

// (*** 4. เพิ่ม Route ใหม่: สำหรับลบงาน ***)
// DELETE /api/tasks/:id (ลบงาน)
router.delete('/:id', protect, deleteTask);

module.exports = router;