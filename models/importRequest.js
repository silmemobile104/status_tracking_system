const mongoose = require('mongoose');

const ImportRequestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['phone', 'accessory'],
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'importing', 'received', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: [{
        type: String // Path to uploaded file
    }],
    details: {
        productName: String,
        quantity: Number,
        importDate: Date,
        importDate: Date,
        importDate: Date,
        description: String,
        supplier: String,
        items: [{                 // (*** เพิ่ม: รองรับหลายสินค้าใน 1 บิล ***)
            productName: String,
            quantity: Number,
            note: String
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImportRequest', ImportRequestSchema);
