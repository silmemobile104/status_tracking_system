const express = require('express');
const router = express.Router();
const deviceClaimController = require('../controllers/deviceClaimController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, deviceClaimController.submitDeviceClaim);
router.get('/', protect, deviceClaimController.getDeviceClaims);
router.put('/:id', protect, deviceClaimController.updateDeviceClaim);

module.exports = router;
