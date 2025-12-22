const express = require('express');
const router = express.Router();
const stockRequestController = require('../controllers/stockRequestController');
const { protect: verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, stockRequestController.createStockRequest);
router.get('/', verifyToken, stockRequestController.getStockRequests);
router.get('/manage', verifyToken, stockRequestController.getManageStockRequests);
router.put('/:id', verifyToken, stockRequestController.updateStockRequest);
router.delete('/:id', verifyToken, stockRequestController.deleteStockRequest);

module.exports = router;
