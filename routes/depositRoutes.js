// routes/depositRoutes.js
const express = require('express');
const router = express.Router();
const { getDeposits, saveDeposit, deleteDeposit, getDepositProducts } = require('../controllers/depositController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDeposits);
router.post('/', protect, saveDeposit); // ใช้ POST เดียวกันทั้งสร้างและแก้ไข
router.delete('/:id', protect, deleteDeposit);
router.get('/products', protect, getDepositProducts);

module.exports = router;