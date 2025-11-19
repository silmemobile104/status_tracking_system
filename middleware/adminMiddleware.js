// server/middleware/adminMiddleware.js

// Middleware นี้จะทำงาน *หลังจาก* 'protect' (ที่ตรวจ Token)
// เพื่อตรวจสอบ "Role"
exports.protectAdmin = (req, res, next) => {
    
    const userRole = req.user.role;

    // อนุญาตเฉพาะ Executive และ Manager
    if (userRole === 'executive' || userRole === 'manager' || userRole === 'hr') {
        next(); // ผ่าน! ไปยัง Controller
    } else {
        res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Admin Only)' });
    }
};