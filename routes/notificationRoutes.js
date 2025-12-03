// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead, deleteNotification, deleteAllNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications (ดึงการแจ้งเตือนที่ยังไม่อ่านทั้งหมด)
router.get('/', protect, getNotifications);

// PUT /api/notifications/read (มาร์คว่าอ่านทั้งหมดแล้ว)
router.put('/read', protect, markAllAsRead);

// DELETE /api/notifications/:id (ลบรายตัว)
router.delete('/:id', protect, deleteNotification);

// DELETE /api/notifications (ลบทั้งหมด)
router.delete('/', protect, deleteAllNotifications);

module.exports = router;