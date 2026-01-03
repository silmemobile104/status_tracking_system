const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { protect: verifyToken, checkRole } = require('../middleware/authMiddleware');

// Create Claim (Staff can create)
router.post('/', verifyToken, claimController.createClaim);

// Get Claims (Staff sees own, Admin sees all - Logic in controller)
router.get('/', verifyToken, claimController.getClaims);

// Update Status (Admin/Manager/Stock - Logic in controller)
router.put('/:id/status', verifyToken, claimController.updateClaimStatus);

module.exports = router;
