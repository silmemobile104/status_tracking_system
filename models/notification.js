// server/models/Notification.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    // (สำคัญ) ID ของ "ผู้รับ" การแจ้งเตือน
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ข้อความแจ้งเตือน
    message: {
        type: String,
        required: true
    },
    // งานที่เกี่ยวข้อง (เพื่อให้คลิกไปดูได้)
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    // สถานะ
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// (สำคัญ) สร้าง Index เพื่อให้ค้นหา "งานที่ยังไม่อ่าน" ของ "user" ได้เร็ว
NotificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);