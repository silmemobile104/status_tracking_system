const Claim = require('../models/claim');

// @desc    Create new claim
// @route   POST /api/claims
// @access  Private (Sales Staff)
exports.createClaim = async (req, res) => {
    try {
        const {
            transferNumber,
            productName,
            productCode,
            quantity,
            problem
        } = req.body;

        const newClaim = new Claim({
            transferNumber,
            branch: req.user.branch || req.user.department,
            companyId: req.user.companyId,
            createdBy: req.user._id,
            productName,
            productCode,
            quantity,
            problem
        });

        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        console.error('Create Claim Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get claims
// @route   GET /api/claims
// @access  Private
exports.getClaims = async (req, res) => {
    try {
        let query = { companyId: req.user.companyId };

        // Check if user is Stock/Store department (Case insensitive)
        const userDept = (req.user.department || '').toLowerCase();
        const stockKeywords = ['stock', 'store', 'สต๊อก', 'คลัง', 'warehouse', 'supply'];
        const isStockTeam = stockKeywords.some(keyword => userDept.includes(keyword));

        const canViewAll = ['admin', 'manager', 'executive'].includes(req.user.role) || isStockTeam;

        // --- Filters from Query ---
        const { branch, status, search, date } = req.query;

        // Status Filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search Filter (Transfer No, Product Name, Code)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { transferNumber: searchRegex },
                { productName: searchRegex },
                { productCode: searchRegex },
                { supplier: searchRegex }
            ];
        }

        // Date Filter
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        // Branch Filter & Permission Logic
        if (req.user.role === 'staff' && !canViewAll) {
            // Staff sees only their branch (Enforced)
            query.branch = req.user.branch;
        } else {
            // Admin/Executive/Stock can filter by branch
            if (branch && branch !== 'all') {
                query.branch = branch;
            }
        }

        const claims = await Claim.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });
    } catch (error) {
        console.error('Get Claims Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update claim status (Admin/Manager/Stock)
// @route   PUT /api/claims/:id/status
// @access  Private (Admin/Manager/Stock)
exports.updateClaimStatus = async (req, res) => {
    try {
        const { status, supplier } = req.body;

        // Check Permissions: Admin/Manager OR Stock Team
        const userDept = (req.user.department || '').toLowerCase();
        const stockKeywords = ['stock', 'store', 'สต๊อก', 'คลัง', 'warehouse', 'supply'];
        const isStockTeam = stockKeywords.some(keyword => userDept.includes(keyword));

        const canUpdate = ['admin', 'manager', 'executive'].includes(req.user.role) || isStockTeam;

        console.log(`[DEBUG] UpdateStatus: User=${req.user.username}, Role=${req.user.role}, Dept=${req.user.department} (${userDept})`);
        console.log(`[DEBUG] isStockTeam=${isStockTeam}, canUpdate=${canUpdate}`);

        if (!canUpdate) {
            return res.status(403).json({
                message: `Not authorized to update claim status. Role: ${req.user.role}, Dept: ${req.user.department}`
            });
        }

        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        if (status) claim.status = status;
        if (supplier !== undefined) claim.supplier = supplier;
        await claim.save();

        res.status(200).json(claim);
    } catch (error) {
        console.error('Update Claim Status Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
