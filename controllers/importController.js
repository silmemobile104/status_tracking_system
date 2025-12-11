const ImportRequest = require('../models/importRequest');

// @desc    Create new import request (Phone or Accessory)
exports.createImport = async (req, res) => {
    try {
        const { type, details } = req.body;
        const files = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        let parsedDetails = {};
        if (details) {
            try {
                parsedDetails = JSON.parse(details);
            } catch (e) {
                parsedDetails = details;
            }
        } else {
            // Construct details from individual body fields (for Accessory)
            parsedDetails = {
                productName: req.body.name,
                quantity: req.body.quantity,
                importDate: req.body.importDate,
                description: req.body.description // Optional
            };
        }

        const newImport = new ImportRequest({
            type,
            branch: req.user.branch || req.user.department,
            companyId: req.user.companyId,
            createdBy: req.user._id,
            files: files,
            details: parsedDetails
        });

        await newImport.save();
        res.status(201).json(newImport);
    } catch (error) {
        console.error('Create Import Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get import requests
exports.getImports = async (req, res) => {
    try {
        const keepingRoles = ['admin', 'manager', 'executive'];
        const isStock = (req.user.department || '').includes('Store') ||
            (req.user.department || '').includes('Stock') ||
            (req.user.department || '').includes('สต๊อก');

        let query = { companyId: req.user.companyId };

        // Filters
        if (req.query.type) {
            if (req.query.type === 'accessory' || req.query.type === 'accessories') {
                query.type = { $in: ['accessory', 'accessories'] };
            } else {
                query.type = req.query.type;
            }
        }
        if (req.query.branch) query.branch = req.query.branch;
        if (req.query.status && req.query.status !== 'all') query.status = req.query.status;

        // Role-based access
        if (req.user.role === 'staff' && !isStock) {
            query.branch = req.user.branch; // Staff sees only their branch
        }
        // Stock/Admin sees all (optionally filtered by branch in query)

        console.log('DEBUG: getImports User:', req.user.username, req.user.role, req.user.department);
        console.log('DEBUG: getImports Query:', query);

        const imports = await ImportRequest.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        console.log('DEBUG: Found imports:', imports.length);

        res.status(200).json(imports);
    } catch (error) {
        console.error('Get Imports Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update status (for Stock/Admin)
exports.updateImportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const importRequest = await ImportRequest.findById(req.params.id);

        if (!importRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        importRequest.status = status;
        await importRequest.save();

        res.status(200).json(importRequest);
    } catch (error) {
        console.error('Update Import Status Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
