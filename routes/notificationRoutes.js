// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications (ดึงการแจ้งเตือนที่ยังไม่อ่านทั้งหมด)
router.get('/', protect, getNotifications);

// PUT /api/notifications/read (มาร์คว่าอ่านทั้งหมดแล้ว)
router.put('/read', protect, markAllAsRead);

module.exports = router;