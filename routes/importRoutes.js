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
        // ดึงนามสกุลไฟล์
        const fileFormat = file.originalname.split('.').pop();

        return {
            folder: 'status_tracking_uploads',
            resource_type: 'auto',
            format: fileFormat, // บังคับนามสกุลเดิม

            // --- เพิ่ม 2 บรรทัดนี้ ---
            use_filename: true, // ใช้ชื่อไฟล์เดิมจากเครื่อง
            unique_filename: false, // ไม่ต้องเติมเลขสุ่มต่อท้าย
            // ---------------------
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
router.delete('/:id', verifyToken, checkRole(['admin', 'manager']), importController.deleteImport);

module.exports = router;