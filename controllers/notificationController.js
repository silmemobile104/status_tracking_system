// server/controllers/notificationController.js

const Notification = require('../models/notification');
const User = require('../models/user');
const Task = require('../models/task');

/**
 * (Helper Function) ฟังก์ชันกลางสำหรับ "สร้าง" การแจ้งเตือน
 * @param {Array<string>} recipientIds - Array ของ User ID ที่จะรับการแจ้งเตือน
 * @param {string} message - ข้อความ
 * @param {string} taskId - ID ของ Task ที่เกี่ยวข้อง
 * @param {string} actorId - (สำคัญ) ID ของ "ผู้กระทำ" (เพื่อไม่ส่งแจ้งเตือนหาตัวเอง)
 */
exports.createNotification = async (recipientIds, message, taskId, actorId) => {
    try {
        // 1. กรอง ID ของ "ผู้กระทำ" ออก (ไม่แจ้งเตือนตัวเอง)
        const finalRecipients = recipientIds.filter(id => id.toString() !== actorId.toString());

        // 2. กันซ้ำ
        const uniqueRecipients = [...new Set(finalRecipients)];

        // 3. สร้าง List ของ Notification documents
        const notifications = uniqueRecipients.map(userId => ({
            user: userId,
            message: message,
            task: taskId,
            isRead: false
        }));

        // 4. บันทึกลง DB ทีเดียวทั้งหมด
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
            console.log(`[Notify] สร้าง ${notifications.length} การแจ้งเตือนสำหรับ Task ${taskId}`);
        }
    } catch (error) {
        console.error('[Notify Error] ไม่สามารถสร้างการแจ้งเตือนได้:', error.message);
    }
};

/**
 * @desc    (API) ดึงการแจ้งเตือน
 * @route   GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
    try {
        // (*** 1. (แก้ไข) ดึง "ประวัติ" 50 อันล่าสุด (ทั้งอ่านแล้วและยังไม่อ่าน) ***)
        const notifications = await Notification.find({
            user: req.user.id,
        })
            .sort({ createdAt: -1 }) // เอาอันใหม่สุดขึ้นก่อน
            .limit(50) // (ใหม่) จำกัดแค่ 50 รายการล่าสุด
            .populate('task', 'title'); // ดึง "ชื่องาน" มาแสดง

        // (*** 2. (ใหม่) นับ "จำนวนที่ยังไม่อ่าน" (สำหรับจุดแดง) ***)
        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            isRead: false
        });

        // (*** 3. (แก้ไข) ส่งกลับเป็น Object ***)
        res.status(200).json({ notifications, unreadCount });

    } catch (error) {
        console.error('Get Notifications Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    (API) มาร์คว่าอ่านทั้งหมดแล้ว
 * @route   PUT /api/notifications/read
 */
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        console.log(`[Notify] User ${req.user.username} อ่านการแจ้งเตือนทั้งหมดแล้ว`);
        res.status(200).json({ message: 'มาร์คว่าอ่านทั้งหมดแล้ว' });
    } catch (error) {
        console.error('Mark as Read Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
     * @desc    (API) ลบการแจ้งเตือน (รายตัว)
     * @route   DELETE /api/notifications/:id
     */
exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;

        // ตรวจสอบว่าเป็นเจ้าของหรือไม่
        const notification = await Notification.findOne({ _id: notificationId, user: req.user.id });
        if (!notification) {
            return res.status(404).json({ message: 'ไม่พบการแจ้งเตือน' });
        }

        await Notification.deleteOne({ _id: notificationId });
        res.status(200).json({ message: 'ลบการแจ้งเตือนสำเร็จ' });

    } catch (error) {
        console.error('Delete Notification Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    (API) ลบการแจ้งเตือนทั้งหมด
 * @route   DELETE /api/notifications
 */
exports.deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ user: req.user.id });
        res.status(200).json({ message: 'ลบการแจ้งเตือนทั้งหมดสำเร็จ' });
    } catch (error) {
        console.error('Delete All Notifications Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};