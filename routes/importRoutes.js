const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const importController = require('../controllers/importController');
const { protect: verifyToken, checkRole } = require('../middleware/authMiddleware');

// Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', verifyToken, upload.array('files', 5), importController.createImport);
router.get('/', verifyToken, importController.getImports);
router.put('/:id/status', verifyToken, checkRole(['admin', 'manager', 'executive', 'staff']), importController.updateImportStatus);

module.exports = router;
