const express = require('express');
const router = express.Router();
const branchStockOrderController = require('../controllers/branchStockOrderController');
const { protect } = require('../middleware/authMiddleware');

// Base Route: /api/branch-stock-orders

// Create Order (Purchasing Only - ideally logic in controller or tighter middleware, but for now strict to authenticated)
router.post('/', protect, branchStockOrderController.createOrder);

// Get Orders (All or Filtered)
router.get('/', protect, branchStockOrderController.getOrders);

// Update/Delete (Optional, for management)
router.put('/:id', protect, branchStockOrderController.updateOrder);
router.delete('/:id', protect, branchStockOrderController.deleteOrder);

module.exports = router;
