const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/importController');
const { protect: verifyToken, checkRole } = require('../middleware/authMiddleware');

// --- เริ่มส่วนที่แก้ไข ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ตั้งค่า Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// กำหนดให้เก็บไฟล์ที่ Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // ดึงนามสกุลไฟล์ออกมา (เช่น .xlsx, .pdf)
        const fileFormat = file.originalname.split('.').pop();
        
        return {
            folder: 'status_tracking_uploads',
            
            // สำคัญ: ให้ Cloudinary ตัดสินใจเองว่าเป็น image หรือ raw
            resource_type: 'auto',
            
            // สำคัญ: สำหรับไฟล์ที่ไม่ใช่รูป (Raw files) เราควรระบุนามสกุลให้ชัดเจน
            // ไม่งั้นตอนโหลดกลับมา ไฟล์จะไม่มีนามสกุล
            format: fileFormat, 
            
            // public_id: file.originalname.split('.')[0] // (เลือกได้) ถ้าอยากให้ชื่อไฟล์บน Cloud เหมือนชื่อเดิม
        };
    },
});

let upload;
try {
    upload = multer({ storage: storage });
} catch (error) {
    console.error('Multer/Cloudinary Storage Init Error:', error);
    upload = multer({ dest: 'uploads/' });
}

// Routes (ส่วนนี้เหมือนเดิม)
router.post('/', verifyToken, upload.array('files', 5), importController.createImport);
router.get('/', verifyToken, importController.getImports);
router.put('/:id/status', verifyToken, checkRole(['admin', 'manager', 'executive', 'staff']), importController.updateImportStatus);

module.exports = router;